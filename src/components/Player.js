import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';

// Suggested code may be subject to a license. Learn more: ~LicenseLog:2387505035.
// import dross1 from '../assets/dross1.mp3';
import Vicissitudes from '../assets/Vicissitudes.mp3'

const WallPaper = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: 'linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)',
  '&::before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background:
      'radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)',
  },
  '&::after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background:
      'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
    transform: 'rotate(30deg)',
  },
});

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}));

const CoverImage = styled('div')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export default function MusicPlayerSlider() {
  const audioRef = React.useRef(new Audio(Vicissitudes));
  const [paused, setPaused] = React.useState(true);
  const [position, setPosition] = React.useState(0);
  const [volume, setVolume] = React.useState(0.5);

  const duration = Math.floor(audioRef.current?.duration || 0);

  React.useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => setPosition(Math.floor(audio.currentTime));
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (paused) {
      audio.play();
    } else {
      audio.pause();
    }
    setPaused(!paused);

    // Dispatch a custom event
    const playStatusChangedEvent = new CustomEvent('play-status-changed', {
      detail: { isPlaying: !paused },
    });
    audioRef.current.dispatchEvent(playStatusChangedEvent);
  };

  const handlePositionChange = (_, value) => {
    const audio = audioRef.current;
    audio.currentTime = value;
    setPosition(value);
  };

  const formatDuration = (value) => {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', p: 3 }}>
      <Widget>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CoverImage>
            <img
              alt='Album cover'
              src='../assets/900x520_piano-min.jpeg'
            />
          </CoverImage>
          <Box sx={{ ml: 1.5, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 500 }}
            >
              Advik Rai
            </Typography>
            <Typography noWrap>
              <b>Piano File</b>
            </Typography>
          </Box>
        </Box>
        <Slider
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          max={duration}
          onChange={handlePositionChange}
          sx={{ color: 'rgba(0,0,0,0.87)', height: 4 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>-{formatDuration(duration - position)}</TinyText>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <IconButton aria-label="previous song">
            <FastRewindRounded fontSize="large" />
          </IconButton>
          <IconButton
            aria-label={paused ? 'play' : 'pause'}
            onClick={togglePlayPause}
          >
            {paused ? (
              <PlayArrowRounded sx={{ fontSize: '3rem' }} />
            ) : (
              <PauseRounded sx={{ fontSize: '3rem' }} />
            )}
          </IconButton>
          <IconButton aria-label="next song">
            <FastForwardRounded fontSize="large" />
          </IconButton>
        </Box>
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          sx={{ mb: 1, px: 1 }}
        >
          <VolumeDownRounded />
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={(_, value) => setVolume(value)}
            sx={{ color: 'rgba(0,0,0,0.87)' }}
          />
          <VolumeUpRounded />
        </Stack>
      </Widget>
      <WallPaper />
    </Box>
  );
}
