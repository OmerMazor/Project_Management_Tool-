import React, { useEffect, useState } from 'react';
import { getServerStatus } from '../../services/api.services'; 
import { HealthApiResponse } from '../../types/healthTypes';

import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Box,
  useTheme,
  Stack,
} from '@mui/material';
import {
  Memory as MemoryIcon,
  DeviceHub as DeviceHubIcon,
  Info as InfoIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import TaskForgeLogo from '../../assets/Taskforge.png';

const ServerHealthStatus: React.FC = () => {
  const [status, setStatus] = useState<HealthApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getServerStatus();
        setStatus(response);
      } catch (err) {
        setError('Failed to fetch server status.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />;

  if (error) return <Alert severity="error" sx={{ marginTop: '20px' }}>{error}</Alert>;

  if (!status) return null;

  return (
    <Container maxWidth="lg" sx={{ marginTop: '20px', paddingBottom: '40px' }}>
      <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
        <img 
          src={TaskForgeLogo} 
          alt="TaskForge Logo" 
          style={{ width: '150px', height: 'auto' }} 
        />
      </Box>
      
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, textAlign: 'center', color: theme.palette.primary.main }}>
        Server Health Status
      </Typography>
      <Grid container spacing={4}>
        
        <Grid item xs={12} md={6}>
          <Card 
            variant="outlined" 
            sx={{ 
              borderRadius: '16px', 
              boxShadow: 3, 
              background: theme.palette.grey[50], 
              transition: '0.3s', 
              '&:hover': {
                boxShadow: 6, 
                background: theme.palette.grey[100],
              }
            }}>
            <CardContent>
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom 
                sx={{ display: 'flex', alignItems: 'center', color: theme.palette.info.main }}>
                <MemoryIcon sx={{ mr: 1 }} /> Application Information
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>Environment:</Typography>
                  <Typography variant="body2">{status.data.application.environment}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>Uptime:</Typography>
                  <Typography variant="body2">{status.data.application.uptime}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>Memory Usage:</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>Heap Total:</Typography>
                        <Typography variant="body2">{status.data.application.memoryUsage.heapTotal}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>Heap Used:</Typography>
                        <Typography variant="body2">{status.data.application.memoryUsage.heapUsed}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            variant="outlined" 
            sx={{ 
              borderRadius: '16px', 
              boxShadow: 3, 
              background: theme.palette.grey[50], 
              transition: '0.3s', 
              '&:hover': {
                boxShadow: 6, 
                background: theme.palette.grey[100],
              }
            }}>
            <CardContent>
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom 
                sx={{ display: 'flex', alignItems: 'center', color: theme.palette.warning.main }}>
                <DeviceHubIcon sx={{ mr: 1 }} /> System Information
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>Total Memory:</Typography>
                  <Typography variant="body2">{status.data.system.totalMemory}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>Free Memory:</Typography>
                  <Typography variant="body2">{status.data.system.freeMemory}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>CPU Usage:</Typography>
                  <Box sx={{ pl: 2 }}>
                    <Stack spacing={1}>
                      {status.data.system.cpuUsage.map((usage, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>CPU Core {index + 1}:</Typography>
                          <Typography variant="body2">{usage}%</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card 
            variant="outlined" 
            sx={{ 
              borderRadius: '16px', 
              boxShadow: 3, 
              background: theme.palette.grey[50], 
              transition: '0.3s', 
              '&:hover': {
                boxShadow: 6, 
                background: theme.palette.grey[100],
              }
            }}>
            <CardContent>
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom 
                sx={{ display: 'flex', alignItems: 'center', color: theme.palette.success.main }}>
                <LanguageIcon sx={{ mr: 1 }} /> Request Information
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>IP:</Typography>
                  <Typography variant="body2">{status.request.ip}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>Method:</Typography>
                  <Typography variant="body2">{status.request.method}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>URL:</Typography>
                  <Typography variant="body2">{status.request.url}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card 
            variant="outlined" 
            sx={{ 
              borderRadius: '16px', 
              boxShadow: 3, 
              background: theme.palette.grey[50], 
              transition: '0.3s', 
              '&:hover': {
                boxShadow: 6, 
                background: theme.palette.grey[100],
              }
            }}>
            <CardContent>
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom 
                sx={{ display: 'flex', alignItems: 'center', color: theme.palette.primary.main }}>
                <InfoIcon sx={{ mr: 1 }} /> Additional Information
              </Typography>
              <Divider sx={{ marginBottom: '16px' }} />
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>Heap Total:</Typography>
                  <Typography variant="body2">{status.data.application.memoryUsage.heapTotal}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" component="div" sx={{ fontWeight: 'bold' }}>Heap Used:</Typography>
                  <Typography variant="body2">{status.data.application.memoryUsage.heapUsed}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServerHealthStatus;
