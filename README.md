# osu! Replay Analyzer

A desktop application built with Electron for analyzing osu! replay files.

## Project Structure

- **src/main/**: Main process files
- **src/main/ipc/**: IPC handlers for communication
- **src/preload/**: Preload scripts for secure IPC bridge
- **src/renderer/**: Renderer process (React UI)
- **src/renderer/pages/**: Page components (Home, Analyze)
- **src/renderer/routes.tsx**: Router configuration using Tanstack Router

## osu! Replay Format (.osr)

This application parses osu! replay files (.osr format). For detailed information about the .osr file format, see the [official osu! wiki documentation](https://osu.ppy.sh/wiki/en/Client/File_formats/Osr_%28file_format%29).

### LZMA Compression

osu! replay files store cursor movement and key press data in a compressed format using the LZMA (Lempel-Ziv-Markov chain algorithm) compression algorithm. The replay data array contains:

- **Time deltas**: Incremental time differences between actions
- **Cursor coordinates**: X and Y positions on screen
- **Key states**: Bitmask representing which keys are pressed

This data is compressed using LZMA to reduce file size, as replays can contain thousands of data points. The application uses the `js-lzma` library to decompress this data before parsing it into readable action frames.

### Technical Parsing Details

#### File Structure

.osr files are binary files with the following structure:

- **Header data**: Game mode, version, beatmap info, player stats (all parsed as various data types)
- **Compressed replay data**: LZMA-compressed binary data containing cursor/input actions

#### LZMA Decompression Process

1. **LZMA Header**: The compressed data starts with a 13-byte header containing:
   - 5 bytes: LZMA properties (lc, lp, pb parameters and dictionary size)
   - 8 bytes: Uncompressed size (little-endian 64-bit integer)

2. **Stream Objects**: The `js-lzma` library requires custom stream objects:
   - `inStream`: Wraps the compressed `Uint8Array` with a `readByte()` method
   - `outStream`: Collects decompressed data with a `writeByte()` method

3. **Decompression**: `LZMA.decompressFile(inStream, outStream)` decompresses the entire stream

#### Action Frame Parsing

After decompression, the data is decoded as UTF-8 text and split by commas. Each action frame follows the format `w|x|y|z`:

- **`w` (time delta)**: Signed 32-bit integer representing milliseconds since the last action
- **`x` (cursor X)**: Float representing horizontal cursor position (0-512 in osu! coordinates)
- **`y` (cursor Y)**: Float representing vertical cursor position (0-384 in osu! coordinates)
- **`z` (keys)**: 32-bit integer bitmask representing pressed keys:
  - Bit 0: Left mouse button (1)
  - Bit 1: Right mouse button (2)
  - Bit 2: Key1 (usually Z, 4)
  - Bit 3: Key2 (usually X, 8)
  - Bit 4: Smoke key (16)

#### Time Calculation

Action times are cumulative - each `w` value is added to a running total to get absolute timestamps from the start of the replay.

#### RNG Seed Handling

For game versions >= 20130319, a special frame with `w = -12345, x = 0, y = 0` contains the RNG seed used for replay desync detection. This frame is extracted and stored separately from the action data.

### Getting Started

1. Install dependencies: `npm install`
2. Start development: `npm run start`
3. Build for production: `npm run make`
