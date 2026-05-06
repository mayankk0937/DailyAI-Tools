import fs from 'fs';
import path from 'path';
import os from 'os';
import youtubedl from 'youtube-dl-exec';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { OpenAI } from "openai";

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Helper to chunk audio
async function chunkAudio(inputFile: string, outputDir: string, chunkDurationSeconds = 600): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const outputPattern = path.join(outputDir, 'chunk_%03d.mp3');
    ffmpeg(inputFile)
      .outputOptions([
        '-f segment',
        `-segment_time ${chunkDurationSeconds}`,
        '-c copy'
      ])
      .output(outputPattern)
      .on('end', () => {
        // Find all generated chunks
        fs.readdir(outputDir, (err, files) => {
          if (err) return reject(err);
          const chunks = files.filter(f => f.startsWith('chunk_') && f.endsWith('.mp3')).map(f => path.join(outputDir, f)).sort();
          resolve(chunks);
        });
      })
      .on('error', (err) => {
        console.error('Error chunking audio:', err);
        reject(err);
      })
      .run();
  });
}

async function transcribeChunk(chunkPath: string): Promise<string> {
  let lastError = null;

  // Try Groq First
  if (process.env.GROQ_API_KEY) {
    try {
      const fileStream = fs.createReadStream(chunkPath);
      const response = await groq.audio.transcriptions.create({
        file: fileStream as any,
        model: "whisper-large-v3",
      });
      return response.text;
    } catch (e: any) {
      console.warn("Groq Whisper failed:", e.message);
      lastError = e;
    }
  }

  // Try OpenAI as fallback
  if (process.env.OPENAI_API_KEY) {
    try {
      const fallbackStream = fs.createReadStream(chunkPath);
      const response = await openai.audio.transcriptions.create({
        file: fallbackStream as any,
        model: "whisper-1",
      });
      return response.text;
    } catch (e: any) {
      console.warn("OpenAI Whisper failed:", e.message);
      lastError = e;
    }
  }

  throw lastError || new Error("All Whisper transcription providers failed");
}

export async function extractAndTranscribe(url: string, onProgress?: (msg: string) => void): Promise<string> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'youtube-audio-'));
  const audioFile = path.join(tmpDir, 'audio.mp3');

  try {
    if (onProgress) onProgress("Captions unavailable. Extracting audio...");
    
    await youtubedl(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: audioFile,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
    });

    if (!fs.existsSync(audioFile)) {
      // Sometimes youtube-dl outputs without extension if specific formats fail, but we enforce output
      // Let's do a simple check
      const files = fs.readdirSync(tmpDir);
      if (files.length === 0) throw new Error("Audio download failed to produce a file");
    }

    if (onProgress) onProgress("Transcribing audio with Whisper...");
    const chunks = await chunkAudio(audioFile, tmpDir, 600); // 10 minutes per chunk

    let fullTranscript = "";
    for (let i = 0; i < chunks.length; i++) {
      if (onProgress && chunks.length > 1) {
        onProgress(`Transcribing audio with Whisper (${Math.round(((i) / chunks.length) * 100)}%)...`);
      }
      const text = await transcribeChunk(chunks[i]);
      fullTranscript += text + " ";
    }

    return fullTranscript.trim();
  } finally {
    // Cleanup
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }
}
