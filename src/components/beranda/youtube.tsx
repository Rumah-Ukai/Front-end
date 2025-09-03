import { useState, useEffect } from 'react';
import { Grid, Stack } from '@mui/material';

interface Video {
    id: number;
    url: string;
}

const YouTubeVideo = () => {
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        fetch('https://tripselbe.fly.dev/youtube')
            .then(response => response.json())
            .then(data => setVideos(data))
            .catch(error => console.error('Error fetching YouTube videos:', error));
    }, []);

    return (
        <Grid container rowSpacing={{ xs: 2, sm: 0, md: 5 }} columnSpacing={{ xs: 0, sm: 0, md: 5 }} justifyContent="center">
            {videos.map(video => (
                <Grid key={video.id} item xs={'auto'}>
                    <Stack width={{ md: '584px', xs: '284px' }} height={{ md: '290px', xs: '160px' }} overflow="hidden">
                        <iframe
                            width="100%"
                            height="100%"
                            src={video.url}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ borderRadius: '40px' }}
                        ></iframe>
                    </Stack>
                </Grid>
            ))}
        </Grid>
    );
}

export default YouTubeVideo;
