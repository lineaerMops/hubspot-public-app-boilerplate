import React, { useState, useEffect } from 'react';
import {
  Button,
  Text,
  Card,
  Badge,
  hubspot,
  useCrmObject,
} from '@hubspot/ui-extensions-react';

// Flexfone Window Calling Component
hubspot.extend(({ context, actions }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [currentCall, setCurrentCall] = useState(null);
  const [contactPhone, setContactPhone] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  
  const { crmObject } = useCrmObject();

  // Get contact phone number from CRM object
  useEffect(() => {
    if (crmObject && crmObject.properties) {
      const phone = crmObject.properties.phone || crmObject.properties.mobilephone || '';
      setContactPhone(phone);
    }
  }, [crmObject]);

  // Initialize Flexfone connection
  const initializeFlexfone = async () => {
    setIsLoading(true);
    try {
      // Simulate Flexfone connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
      
      actions.addAlert({
        message: 'Flexfone forbindelse etableret',
        type: 'success'
      });
    } catch (error) {
      actions.addAlert({
        message: 'Fejl ved forbindelse til Flexfone: ' + error.message,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Make outbound call
  const handleMakeCall = async () => {
    if (!contactPhone) {
      actions.addAlert({
        message: 'Ingen telefonnummer fundet for denne kontakt',
        type: 'error'
      });
      return;
    }

    if (!isConnected) {
      actions.addAlert({
        message: 'Forbind først til Flexfone',
        type: 'error'
      });
      return;
    }

    setCallStatus('calling');
    setIsLoading(true);
    
    try {
      // Simulate call initiation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const callResult = {
        id: 'call-' + Date.now(),
        toNumber: contactPhone,
        fromNumber: 'Flexfone',
        type: 'outbound',
        status: 'connected'
      };
      
      setCurrentCall(callResult);
      setCallStatus('connected');
      
      actions.addAlert({
        message: `Opkald startet til ${contactPhone}`,
        type: 'success'
      });
      
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

  // End current call
  const handleEndCall = async () => {
    if (!currentCall) return;
    
    setCallStatus('ending');
    setIsLoading(true);
    
    try {
      // Simulate call ending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to call history
      setCallHistory(prev => [...prev, {
        id: currentCall.id,
        phoneNumber: currentCall.toNumber,
        duration: 120, // Simulated duration
        status: 'completed',
        timestamp: new Date().toISOString()
      }]);
      
      actions.addAlert({
        message: 'Opkald afsluttet og logget',
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
      setCurrentCall(null);
    }
  };

  // Handle incoming call
  const handleIncomingCall = async (incomingCall) => {
    setCurrentCall(incomingCall);
    setCallStatus('incoming');
    
    actions.addAlert({
      message: `Indgående opkald fra ${incomingCall.fromNumber}`,
      type: 'info'
    });
  };

  // Answer incoming call
  const handleAnswerCall = async () => {
    if (!currentCall) return;
    
    try {
      setCallStatus('connected');
      
      actions.addAlert({
        message: 'Opkald besvaret',
        type: 'success'
      });
    } catch (error) {
      actions.addAlert({
        message: 'Fejl ved besvarelse af opkald: ' + error.message,
        type: 'error'
      });
    }
  };

  // Reject incoming call
  const handleRejectCall = async () => {
    if (!currentCall) return;
    
    try {
      setCallStatus('idle');
      setCurrentCall(null);
      
      actions.addAlert({
        message: 'Opkald afvist',
        type: 'info'
      });
    } catch (error) {
      actions.addAlert({
        message: 'Fejl ved afvisning af opkald: ' + error.message,
        type: 'error'
      });
    }
  };

  const getCallStatusColor = () => {
    switch (callStatus) {
      case 'calling': return 'warning';
      case 'connected': return 'success';
      case 'incoming': return 'info';
      case 'ending': return 'default';
      default: return 'default';
    }
  };

  const getCallStatusText = () => {
    switch (callStatus) {
      case 'calling': return 'Ringer...';
      case 'connected': return 'I samtale';
      case 'incoming': return 'Indgående opkald';
      case 'ending': return 'Afslutter...';
      default: return 'Klar';
    }
  };

  return (
    <div style={{ padding: '16px', height: '100vh', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Text variant="heading" style={{ marginRight: '8px' }}>
          Flexfone Calling Window
        </Text>
        <Badge variant={isConnected ? 'success' : 'default'}>
          {isConnected ? 'Tilsluttet' : 'Ikke tilsluttet'}
        </Badge>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ padding: '16px' }}>
            <Button
              onClick={initializeFlexfone}
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? 'Forbinder...' : 'Forbind til Flexfone'}
            </Button>
          </div>
        </Card>
      )}

      {/* Contact Info */}
      {contactPhone && (
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ padding: '16px' }}>
            <Text variant="body" style={{ marginBottom: '4px' }}>
              Kontakt: {crmObject?.properties?.firstname} {crmObject?.properties?.lastname}
            </Text>
            <Text variant="body" style={{ marginBottom: '4px' }}>
              Telefonnummer: {contactPhone}
            </Text>
          </div>
        </Card>
      )}

      {/* Call Controls */}
      {isConnected && (
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {callStatus === 'idle' && (
                <Button
                  onClick={handleMakeCall}
                  disabled={isLoading || !contactPhone}
                  variant="primary"
                >
                  Ring op
                </Button>
              )}
              
              {callStatus === 'connected' && (
                <>
                  <Button
                    onClick={handleEndCall}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    Afslut opkald
                  </Button>
                  <Button
                    onClick={() => actions.addAlert({ message: 'Hold funktion', type: 'info' })}
                    disabled={isLoading}
                    variant="secondary"
                  >
                    Hold
                  </Button>
                  <Button
                    onClick={() => actions.addAlert({ message: 'Mute funktion', type: 'info' })}
                    disabled={isLoading}
                    variant="secondary"
                  >
                    Mute
                  </Button>
                </>
              )}
              
              {callStatus === 'incoming' && (
                <>
                  <Button
                    onClick={handleAnswerCall}
                    disabled={isLoading}
                    variant="success"
                  >
                    Besvar
                  </Button>
                  <Button
                    onClick={handleRejectCall}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    Afvis
                  </Button>
                </>
              )}
            </div>
            
            <Badge variant={getCallStatusColor()}>
              {getCallStatusText()}
            </Badge>
          </div>
        </Card>
      )}

      {/* Call Info */}
      {currentCall && (
        <Card style={{ marginBottom: '16px' }}>
          <div style={{ padding: '16px' }}>
            <Text variant="body" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
              Aktive opkald:
            </Text>
            <div style={{ fontSize: '12px' }}>
              <div>Fra: {currentCall.fromNumber}</div>
              <div>Til: {currentCall.toNumber}</div>
              <div>Type: {currentCall.type}</div>
              {currentCall.duration && (
                <div>Varighed: {currentCall.duration}s</div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Call History */}
      {callHistory.length > 0 && (
        <Card>
          <div style={{ padding: '16px' }}>
            <Text variant="heading" style={{ marginBottom: '8px' }}>
              Opkaldshistorik
            </Text>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {callHistory.map((call, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  border: '1px solid #e1e5e9', 
                  borderRadius: '4px', 
                  marginBottom: '4px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{new Date(call.timestamp).toLocaleString('da-DK')}</span>
                    <Badge variant={call.status === 'completed' ? 'success' : 'default'}>
                      {call.status === 'completed' ? 'Gennemført' : 'Ikke besvaret'}
                    </Badge>
                  </div>
                  <div>Nummer: {call.phoneNumber}</div>
                  <div>Varighed: {call.duration}s</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
});
