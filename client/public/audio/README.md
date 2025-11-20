# 🎵 Audio System - File Guide

This directory contains all audio files for the Pokémon Battle Tower game.

## 📁 Directory Structure

```
audio/
├── music/          # Background music tracks
│   ├── menu.mp3
│   ├── battle_1.mp3
│   ├── battle_2.mp3
│   ├── battle_3.mp3
│   ├── battle_4.mp3
│   ├── boss_battle.mp3
│   ├── victory.mp3
│   └── defeat.mp3
│
└── sfx/            # Sound effects
    ├── attack_[type].mp3    # Type-specific attack sounds
    ├── hit_*.mp3            # Hit feedback sounds
    ├── pokemon_*.mp3        # Pokemon-related sounds
    └── ui_*.mp3             # UI interaction sounds
```

## 🎼 Music Tracks

### Background Music (BGM)
- **menu.mp3** - Main menu theme
- **battle_1.mp3** - Floors 1-5 (Early game)
- **battle_2.mp3** - Floors 6-10 (Mid game)
- **battle_3.mp3** - Floors 11-15 (Late game)
- **battle_4.mp3** - Floors 16-19 (Endgame)
- **boss_battle.mp3** - Floor 20 (Final boss)
- **victory.mp3** - Victory fanfare (plays once)
- **defeat.mp3** - Game over theme (plays once)

### Recommended Format
- **Format**: MP3 or OGG
- **Bitrate**: 128-192 kbps
- **Loop**: Tracks should be seamless (except victory/defeat)
- **Duration**: 1-3 minutes

## 🔊 Sound Effects (SFX)

### Type-Specific Attack Sounds
Create 18 attack sound files (one per type):
```
attack_normal.mp3
attack_fire.mp3
attack_water.mp3
attack_grass.mp3
attack_electric.mp3
attack_ice.mp3
attack_fighting.mp3
attack_poison.mp3
attack_ground.mp3
attack_flying.mp3
attack_psychic.mp3
attack_bug.mp3
attack_rock.mp3
attack_ghost.mp3
attack_dragon.mp3
attack_dark.mp3
attack_steel.mp3
attack_fairy.mp3
```

### Hit Feedback Sounds
```
hit_normal.mp3           # Standard hit
hit_critical.mp3         # Critical hit (powerful impact)
hit_super_effective.mp3  # Super effective hit (strong)
hit_not_very_effective.mp3  # Not very effective (weak thud)
```

### Pokemon Sounds
```
pokemon_faint.mp3        # When a Pokemon faints
pokemon_switch.mp3       # Switching Pokemon
```

### Reward & UI Sounds
```
victory.mp3              # Battle victory jingle
defeat.mp3               # Battle defeat sound
level_up.mp3             # Stat buff reward
heal.mp3                 # Heal reward (restoration sound)
catch.mp3                # Catching new Pokemon
button_click.mp3         # UI button press
menu_select.mp3          # Menu selection
```

### Recommended Format
- **Format**: MP3 or OGG
- **Bitrate**: 96-128 kbps
- **Duration**: 0.3-2 seconds (short and punchy)
- **Mono**: Acceptable for SFX to save space

## 🎨 Sound Design Tips

### Attack Sounds
- **Fire**: Whoosh, flame burst
- **Water**: Splash, wave crash
- **Electric**: Zap, thunder crack
- **Grass**: Rustle, vine whip
- **Ice**: Crystallize, frost
- **Rock**: Boulder crash, rumble
- **Psychic**: Ethereal whoosh, mind blast
- **Ghost**: Eerie whisper, spectral
- **Dragon**: Roar, powerful blast

### Hit Sounds
- **Normal**: Standard impact (thud)
- **Critical**: Heavy impact with reverb
- **Super Effective**: Satisfying crunch/explosion
- **Not Very Effective**: Dull thunk/deflect

## 🔍 Finding Audio Resources

### Free Audio Sources
1. **Freesound.org** - Community sound library (CC licenses)
2. **Zapsplat.com** - Free game SFX
3. **OpenGameArt.org** - Game music & SFX
4. **Incompetech.com** - Royalty-free music
5. **Bensound.com** - Royalty-free music

### Pokemon Fan Resources
- Search for "Pokemon sound effects" on YouTube
- Use audio extraction tools (with proper licensing)
- Pokemon Showdown has open-source sounds
- PokeAPI doesn't have audio, but community has created packs

### AI Generation
- **Eleven Labs** - Generate custom SFX
- **Soundraw.io** - Generate music
- **AIVA** - AI music composer

## ⚙️ Technical Specifications

### Supported Formats
The Howler.js library supports:
- MP3 (best compatibility)
- OGG (good compression)
- WAV (highest quality, large files)
- WEBM (modern browsers)
- AAC/M4A (Apple devices)

### Recommended: MP3
- Universal browser support
- Good compression ratio
- Acceptable quality at 128kbps

### File Size Considerations
- **Music**: ~1-3 MB per track (128kbps, 2-3 min)
- **SFX**: ~10-50 KB per sound (0.3-1 sec)
- **Total estimate**: ~15-25 MB for full audio

## 🚀 Implementation

The audio system is already implemented! Just add audio files to the appropriate directories, and they will be automatically loaded.

### How It Works
1. **AudioManager.js** handles all audio playback
2. **useAudio.js** provides React hook for components
3. **AudioControls.jsx** gives users volume/toggle controls
4. Files are loaded on-demand via Howler.js

### Testing Without Audio Files
The system will gracefully fail if audio files are missing:
- Console warnings will appear
- Game functionality continues normally
- No errors or crashes

### Adding Your First Sound
1. Place an MP3 file in `/public/audio/sfx/attack_fire.mp3`
2. Reload the game
3. Attack with a Fire-type Pokemon
4. You should hear the sound!

## 📝 License & Attribution

**Important**: Ensure you have proper licenses for all audio files!
- Check license requirements (attribution, commercial use, etc.)
- Add credits to your game's credits screen
- Keep a `CREDITS.txt` file listing all audio sources

## 🛠️ Customization

### Changing Audio Files
Simply replace files in the directories. The system uses file paths, so matching names is important.

### Adjusting Volume
Users can adjust volumes in-game via the 🎵 button in the bottom-right corner.

### Adding New Sounds
To add new sound effects, edit:
- `client/src/services/AudioManager.js` - Add preload call
- `client/src/hooks/useAudio.js` - Export new function
- Use the new function in your components

## 🐛 Troubleshooting

### Sound Not Playing
1. Check browser console for errors
2. Verify file exists in `/public/audio/`
3. Check file format (MP3 recommended)
4. Ensure audio controls are enabled (🎵 button)
5. Check browser allows audio (some block autoplay)

### Music Not Looping
1. Music should loop automatically (except victory/defeat)
2. Check AudioManager.js `playMusic()` - `loop: true`

### Performance Issues
1. Reduce bitrate of audio files
2. Convert to more compressed format
3. Reduce number of simultaneous sounds

---

**Ready to add sounds?** Just drop audio files into the directories above and enjoy! 🎮🎵
