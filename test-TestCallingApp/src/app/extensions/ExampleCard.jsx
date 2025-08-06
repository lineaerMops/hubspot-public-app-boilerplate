import React, { useState } from 'react';
import {
  Button,
  Text,
  hubspot,
} from '@hubspot/ui-extensions-react';

hubspot.extend(({ context, runServerlessFunction, actions }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      // Din app logik her
      actions.addAlert({
        message: 'Action completed!',
        type: 'success'
      });
    } catch (error) {
      actions.addAlert({
        message: 'Error: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Text>Min HubSpot App</Text>
      <Button
        onClick={handleAction}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Klik her'}
      </Button>
    </div>
  );
});
