import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Genetic Constants
const BINARY_TO_NUCLEOTIDE = {
  '00': 'A', '01': 'C', '10': 'G', '11': 'T'
};

const NUCLEOTIDE_TO_BINARY = {
  'A': '00', 'C': '01', 'G': '10', 'T': '11'
};

const HEX_TO_DINUCLEOTIDE = {
  '0': 'AA', '1': 'AC', '2': 'AG', '3': 'AT',
  '4': 'CA', '5': 'CC', '6': 'CG', '7': 'CT',
  '8': 'GA', '9': 'GC', 'a': 'GG', 'b': 'GT',
  'c': 'TA', 'd': 'TC', 'e': 'TG', 'f': 'TT'
};

const DINUCLEOTIDE_TO_HEX = Object.fromEntries(
  Object.entries(HEX_TO_DINUCLEOTIDE).map(([k, v]) => [v, k])
);

const QVTX_HEADER = 'ATGCGATCGATCG';
const QVTX_FOOTER = 'TAATAATAA';

// DNA Encoder Functions
function bufferToDNA(buffer) {
  let dna = '';
  for (const byte of buffer) {
    const binary = byte.toString(2).padStart(8, '0');
    for (let i = 0; i < 8; i += 2) {
      dna += BINARY_TO_NUCLEOTIDE[binary.substring(i, i + 2)];
    }
  }
  return dna;
}

function dnaToBuffer(dna) {
  const bytes = [];
  for (let i = 0; i < dna.length; i += 4) {
    let chunk = dna.substring(i, i + 4);
    if (chunk.length < 4) chunk = chunk.padEnd(4, 'A');
    let binary = '';
    for (const n of chunk) {
      binary += NUCLEOTIDE_TO_BINARY[n] || '00';
    }
    bytes.push(parseInt(binary, 2));
  }
  return new Uint8Array(bytes);
}

function hexToDNA(hex) {
  let dna = '';
  for (const char of hex.toLowerCase()) {
    if (HEX_TO_DINUCLEOTIDE[char]) {
      dna += HEX_TO_DINUCLEOTIDE[char];
    }
  }
  return dna;
}

function dnaToHex(dna) {
  let hex = '';
  for (let i = 0; i < dna.length; i += 2) {
    const dinuc = dna.substring(i, i + 2);
    if (dinuc.length === 2 && DINUCLEOTIDE_TO_HEX[dinuc]) {
      hex += DINUCLEOTIDE_TO_HEX[dinuc];
    }
  }
  return hex;
}

function stringToDNA(text) {
  const encoder = new TextEncoder();
  return bufferToDNA(encoder.encode(text));
}

function dnaToString(dna) {
  const decoder = new TextDecoder();
  return decoder.decode(dnaToBuffer(dna)).replace(/\0/g, '');
}

function gcContent(dna) {
  const total = dna.length || 1;
  const gc = (dna.split('G').length - 1) + (dna.split('C').length - 1);
  return (gc / total * 100).toFixed(2);
}

function frequencySignature(dna) {
  const total = dna.length || 1;
  return {
    A: ((dna.split('A').length - 1) / total * 100).toFixed(2),
    C: ((dna.split('C').length - 1) / total * 100).toFixed(2),
    G: ((dna.split('G').length - 1) / total * 100).toFixed(2),
    T: ((dna.split('T').length - 1) / total * 100).toFixed(2)
  };
}

async function hashToDNA(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexToDNA(hashHex);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { operation, data, dna } = await req.json();

    let result = {};

    switch (operation) {
      case 'encode_string':
        const encodedDNA = stringToDNA(data);
        result = {
          dna: QVTX_HEADER + encodedDNA + QVTX_FOOTER,
          length: encodedDNA.length,
          gcContent: gcContent(encodedDNA),
          frequency: frequencySignature(encodedDNA)
        };
        break;

      case 'decode_string':
        const cleanDNA = dna.replace(QVTX_HEADER, '').replace(QVTX_FOOTER, '');
        result = {
          text: dnaToString(cleanDNA),
          originalLength: dna.length
        };
        break;

      case 'encode_json':
        const jsonString = JSON.stringify(data);
        const jsonDNA = stringToDNA(jsonString);
        result = {
          dna: QVTX_HEADER + jsonDNA + QVTX_FOOTER,
          length: jsonDNA.length,
          gcContent: gcContent(jsonDNA),
          frequency: frequencySignature(jsonDNA)
        };
        break;

      case 'decode_json':
        const cleanJSONDNA = dna.replace(QVTX_HEADER, '').replace(QVTX_FOOTER, '');
        const jsonText = dnaToString(cleanJSONDNA);
        result = {
          data: JSON.parse(jsonText),
          originalLength: dna.length
        };
        break;

      case 'hash':
        result = {
          hash: await hashToDNA(data),
          algorithm: 'SHA-256-DNA'
        };
        break;

      case 'analyze':
        result = {
          length: dna.length,
          gcContent: gcContent(dna),
          frequency: frequencySignature(dna),
          hasHeader: dna.startsWith(QVTX_HEADER),
          hasFooter: dna.endsWith(QVTX_FOOTER)
        };
        break;

      default:
        return Response.json({ error: 'Invalid operation' }, { status: 400 });
    }

    return Response.json({ 
      success: true, 
      operation,
      result,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('DNA encoding error:', error);
    return Response.json({ 
      error: error.message || 'DNA operation failed' 
    }, { status: 500 });
  }
});