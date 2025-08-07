import React, { useState, useEffect } from 'react';
import {
  Button,
  Text,
  Card,
  Badge,
  hubspot,
  useCrmObject,
} from '@hubspot/ui-extensions';

// Simple Flexfone Calling Card Component
hubspot.extend(({ context, actions }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [contactPhone, setContactPhone] = useState('');
  const [lastCallTime, setLastCallTime] = useState(null);
  
  const { crmObject } = useCrmObject();
  
  // Get contact phone number from CRM object
  useEffect(() => {
    if (crmObject && crmObject.properties) {
      const phone = crmObject.properties.phone || crmObject.properties.mobilephone || '';
      setContactPhone(phone);
    }
  }, [crmObject]);

  // Simulate making a call (this would integrate with Flexfone API)
  const makeCall = async () => {
    if (!contactPhone) {
      actions.addAlert({
        message: 'Ingen telefonnummer fundet for denne kontakt',
        type: 'error'
      });
      return;
    }

    setCallStatus('calling');
    setIsLoading(true);
    
    try {
      // Simulate call initiation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCallStatus('connected');
      setLastCallTime(new Date().toLocaleString('da-DK'));
      
      actions.addAlert({
        message: `Opkald startet til ${contactPhone}`,
        type: 'success'
      });
      
      // Log the call to HubSpot
      await logCallToHubSpot();
      
    } catch (error) {
      setCallStatus('idle');
      actions.addAlert({
        message: 'Fejl ved opkald: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // End call
  const endCall = async () => {
    setCallStatus('ended');
    setIsLoading(true);
    
    try {
      // Simulate call ending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      actions.addAlert({
        message: 'Opkald afsluttet',
        type: 'success'
      });
    } catch (error) {
      actions.addAlert({
        message: 'Fejl ved afslutning af opkald: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
      setCallStatus('idle');
    }
  };

  // Log call to HubSpot (this would create a call record)
  const logCallToHubSpot = async () => {
    try {
      // This would integrate with HubSpot's calling API
      // For now, we'll just show a success message
      actions.addAlert({
        message: 'Opkald logget til HubSpot',
        type: 'success'
      });
    } catch (error) {
      actions.addAlert({
        message: 'Fejl ved logging af opkald: ' + error.message,
        type: 'error'
      });
    }
  };

  const getCallStatusColor = () => {
    switch (callStatus) {
      case 'calling': return 'warning';
      case 'connected': return 'success';
      case 'ended': return 'info';
      default: return 'default';
    }
  };

  const getCallStatusText = () => {
    switch (callStatus) {
      case 'calling': return 'Ringer...';
      case 'connected': return 'I samtale';
      case 'ended': return 'Afsluttet';
      default: return 'Klar';
    }
  };

  return (
    <Card>
      <div style={{ padding: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Text variant="heading" style={{ marginRight: '8px' }}>
            Flexfone Calling
          </Text>
          <Badge variant="default">
            Demo Version
          </Badge>
        </div>

        {/* Contact Info */}
        {contactPhone && (
          <div style={{ marginBottom: '16px' }}>
            <Text variant="body" style={{ marginBottom: '4px' }}>
              Telefonnummer: {contactPhone}
            </Text>
          </div>
        )}

        {/* Call Controls */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <Button
              onClick={makeCall}
              disabled={isLoading || callStatus === 'calling' || callStatus === 'connected'}
              variant="primary"
            >
              {isLoading ? 'Ringer...' : 'Ring op (Demo)'}
            </Button>
            
            {(callStatus === 'calling' || callStatus === 'connected') && (
              <Button
                onClick={endCall}
                disabled={isLoading}
                variant="destructive"
              >
                Afslut opkald
              </Button>
            )}
          </div>
          
          <Badge variant={getCallStatusColor()}>
            {getCallStatusText()}
          </Badge>
        </div>

        {/* Last Call Info */}
        {lastCallTime && (
          <div style={{ marginBottom: '16px' }}>
            <Text variant="body" style={{ fontSize: '12px', color: '#6b7280' }}>
              Sidste opkald: {lastCallTime}
            </Text>
          </div>
        )}

        {/* Instructions */}
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <Text variant="body" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
            Næste skridt:
          </Text>
          <ul style={{ margin: '0', paddingLeft: '16px' }}>
            <li>Integrer med Flexfone API</li>
            <li>Konfigurer remote calling</li>
            <li>Tilføj call logging til HubSpot</li>
            <li>Test med rigtige opkald</li>
          </ul>
        </div>
      </div>
    </Card>
  );
});
