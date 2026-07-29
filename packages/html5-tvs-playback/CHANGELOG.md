# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.4.0 (2026-07-29)

### Bug Fixes

- **attributes:** resolve problem where video element height isn't set properly ([5d195e6](https://github.com/clappr/clappr/commit/5d195e65d3d237be0f44cf628987771d3d8dcaf3))
- **audio:** resolve muted audio issues when switching audio ([b4274f1](https://github.com/clappr/clappr/commit/b4274f135d15e5a3df67671c549aa11c5ec75c50))
- **drm:** update the message for inexistent license server URL case ([29853cc](https://github.com/clappr/clappr/commit/29853cce9359a330d4a74a1d34353db6bc94788c))
- **html5_playback:** fix looping over audio tracks ([b9c82f3](https://github.com/clappr/clappr/commit/b9c82f385e7b5f34fc82acad4eb065dcb2d18ad7))
- **html5_playback:** fix progress event log message ([0e0b649](https://github.com/clappr/clappr/commit/0e0b6492a360508618435abf4d5e7113359d54a8))
- **html5_playback:** fix raw code to be the error from appropriate origin ([6768c3a](https://github.com/clappr/clappr/commit/6768c3ab4f054a993021d6aa35f614fb193fc588))
- **html5_playback:** prevent exceptions due to invalid seekable time ranges access ([f70cbfc](https://github.com/clappr/clappr/commit/f70cbfc257538f08042e833ed703553ff37c2b51))
- **html5_playback:** remove audio track listeners on destroy ([41541d6](https://github.com/clappr/clappr/commit/41541d6387b7655d2fee4a974db70de3f6f68bba))
- **html5_playback:** set width property on video element ([8eb4a28](https://github.com/clappr/clappr/commit/8eb4a28025bfd64b61c821f8d4a5805c2c684d16))
- **html5_playback:** update playback to be ready at HAVE_FUTURE_DATA ([f510ac1](https://github.com/clappr/clappr/commit/f510ac1d8e23ea4da50ea7602df6c0561c9e33e8))
- **html5-tvs-playback:** declare @babel/runtime as runtime dependency ([6769fcc](https://github.com/clappr/clappr/commit/6769fccd50320bb9be86ce1826c3a9bff438826d))
- **html5-tvs-playback:** widen @babel/runtime range to dedupe in workspace ([caf770f](https://github.com/clappr/clappr/commit/caf770f15e196cd76a0b1c8c8da4ee33cbf936b1))

### Features

- **drm_handler:** allow playback when oipfdrmagent.sendDRMMessage is not available ([03e514b](https://github.com/clappr/clappr/commit/03e514bb2f96949a8b31d94ea25c63f293869653))
- **drm:** support pre acquisiton license request ([371db6d](https://github.com/clappr/clappr/commit/371db6d6077ee2c2f027f44d1d53acf4fa4178b0))
- **html5_playback:** add error listener to video source element ([0935837](https://github.com/clappr/clappr/commit/093583792201ab0899fc1b0328d1db552fb6e0ba))
- **html5_playback:** add load method ([0c17de6](https://github.com/clappr/clappr/commit/0c17de67be89d789eb0c23eaa9a4379fed1c61c2))
- **html5_playback:** add option to disable DRM Setup ([bcba50c](https://github.com/clappr/clappr/commit/bcba50ce955a800b414ba0964f6b43595b5b13f2))
- **html5_playback:** create config getter ([ebe0bdd](https://github.com/clappr/clappr/commit/ebe0bddc58faedbc704c706a465ae0c8b722eb43))
- **html5_video:** log every videoElement event ([f6fd66e](https://github.com/clappr/clappr/commit/f6fd66e5c4cbcd13dae312f113d62260f0962eab))
- **html5_video:** overwrite getters inherited from Playback class ([f09db58](https://github.com/clappr/clappr/commit/f09db5877abf7c578b1bcd0ca7c7752a83a233bc))
- **html5_video:** proxy video element events via Clappr events ([56a8fcd](https://github.com/clappr/clappr/commit/56a8fcd2ed7d4ac6d3040f7398dc3922209eee49))
- **playback:** add audio track related events and change public audio track interface ([b4561a3](https://github.com/clappr/clappr/commit/b4561a3d17d65eba7b985e32d05e0c639316d474))
- **playback:** add new get and setters to use and change private properties ([504862e](https://github.com/clappr/clappr/commit/504862e45bbb879d746ee3c58b837d199022f2b0))
- **public:** add commented config for DRM ([bd2d729](https://github.com/clappr/clappr/commit/bd2d72938dbcf0366c40254bab2fa3e06e52d4ae))
- **public:** add m3u8 example ([c0735e4](https://github.com/clappr/clappr/commit/c0735e43f6407feda0fde5bd05ed169f17127a99))
- **public:** add smooth streaming with DRM example ([3ee6ac7](https://github.com/clappr/clappr/commit/3ee6ac7a57a0aa9f5f7b329a70a1ae8225b8088f))
- **public:** map stop key ([97414bc](https://github.com/clappr/clappr/commit/97414bcd27d0d4503dbf555cfca6bc35e201dde8))
- **public:** signalize buffer events ([64e649d](https://github.com/clappr/clappr/commit/64e649db26aa5fe268500b84f03715b238e82c3c))
- **src:** creat drm_handler module ([294ccde](https://github.com/clappr/clappr/commit/294ccdeb2ce43fa98150eae1297a36ebf4c2848b))
- **src:** supports smoothstraming content ([c6025ab](https://github.com/clappr/clappr/commit/c6025ab0fa175648ff79fb24de486157410c699a))
- **utils:** create DEFAULT_MINIMUM_DVR_SIZE constant ([51a7d49](https://github.com/clappr/clappr/commit/51a7d49888665a1f4d9e39524253e9049c6c2050))
- **utils:** create LIVE_STATE_THRESHOLD constant ([e36318e](https://github.com/clappr/clappr/commit/e36318e3c9637a27f5f2e1fdf2f76899cbaac1d7))
