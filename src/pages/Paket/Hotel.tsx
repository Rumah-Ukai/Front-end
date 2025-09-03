import { Stack, Typography, Button, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

interface TryoutDetailProps {
  tryoutData: TryoutDetail;
}

export function TryoutDetail({ tryoutData }: TryoutDetailProps) {
  return (
    <Stack spacing={4} sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
        {tryoutData.title}
      </Typography>
      
      <Stack spacing={2}>
        <Typography>
          <strong>Opened:</strong> {tryoutData.opened}
        </Typography>
        <Typography>
          <strong>Closed:</strong> {tryoutData.closed}
        </Typography>
        <Typography>
          <strong>Attempts allowed:</strong> {tryoutData.attemptsAllowed}
        </Typography>
        <Typography>
          <strong>Time limit:</strong> {tryoutData.timeLimit}
        </Typography>
        <Typography>
          <strong>Grading method:</strong> {tryoutData.gradingMethod}
        </Typography>
      </Stack>
      
      <Divider />
      
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        Summary of your previous attempts
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Attempt</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Grade / 100.00</TableCell>
              <TableCell>Review</TableCell>
              <TableCell>Submitted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tryoutData.attempts.map((attempt) => (
              <TableRow key={attempt.id}>
                <TableCell>{attempt.id}</TableCell>
                <TableCell>{attempt.state}</TableCell>
                <TableCell>{attempt.grade}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">
                    Review
                  </Button>
                </TableCell>
                <TableCell>{attempt.submitted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        Materi Pembahasan
      </Typography>
      
      <Stack spacing={1}>
        {tryoutData.materials.map((material, idx) => (
          <Button
            key={idx}
            variant="outlined"
            startIcon={<Icon icon="vscode-icons:file-type-pdf2" />}
            component="a"
            href={material.url}
            target="_blank"
            sx={{ 
              justifyContent: 'flex-start',
              textTransform: 'none'
            }}
          >
            {material.title} ({material.type})
          </Button>
        ))}
      </Stack>
      
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 4, alignSelf: 'flex-start' }}
        component={Link}
        to={`/tryout/${tryoutData.title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        Start New Attempt
      </Button>
    </Stack>
  );
}