import { useAtom } from 'jotai';
import { groupedModelsAtom, modelsLoadingAtom } from '../atoms';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function Sidebar({ isDrawerOpen, toggleDrawer }) {
  const greencolor = '#B6D9D7';
  const history = ['Something','dasda']; // Add more items if needed
  const [groupedModels] = useAtom(groupedModelsAtom);
  const [loading] = useAtom(modelsLoadingAtom);

  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={toggleDrawer(false)}
      sx={{
        '& .MuiDrawer-paper': { width: 300, bgcolor: '#121212', color: 'white', fontFamily: 'JetBrains Mono' },
        '.css-rizt0-MuiTypography-root': { fontFamily: 'JetBrains Mono' },
      }}
    >
      {/* History Section */}
      <List>
        <ListItem>
          <ListItemText
            primary="History"
            sx={{ color: 'white', fontWeight: 'bold' }}
          />
        </ListItem>
      </List>
      <Divider sx={{ bgcolor: greencolor }} />

      <List>
        {history.map((text) => (
          <ListItem
            key={text}
            button
            onClick={toggleDrawer(false)}
            sx={{
              transition: 'background-color 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <ListItemText
              primary={text}
              sx={{ color: greencolor}}
            />
          </ListItem>
        ))}
      </List>

      {/* Available Models Section */}
      <List sx={{ mt: 2 }}>
        <ListItem>
          <ListItemText
            primary="Available Models"
            sx={{ color: 'white', fontWeight: 'bold' }}
          />
        </ListItem>
      </List>
      <Divider sx={{ bgcolor: greencolor }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
          <CircularProgress size={24} sx={{ color: greencolor }} />
        </Box>
      ) : (
        <List>
          {Object.entries(groupedModels).map(([provider, providerModels]) => (
            <Box key={provider}>
              <ListItem>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                  }}
                >
                  {provider}
                </Typography>
              </ListItem>
              
              {providerModels.map((model) => (
                <ListItem
                  key={model.id}
                  sx={{
                    pl: 3,
                    transition: 'background-color 0.2s ease-in-out',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <ListItemText
                    primary={model.name}
                    sx={{
                      color: greencolor,
                      '& .MuiTypography-root': {
                        fontSize: '0.9rem',
                      },
                    }}
                  />
                </ListItem>
              ))}
            </Box>
          ))}
        </List>
      )}
    </Drawer>
  );
}