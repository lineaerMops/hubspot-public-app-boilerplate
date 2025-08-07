import React, { useState, useEffect } from 'react';
import {
  Button,
  Text,
  Card,
  Badge,
  hubspot,
  useCrmObject,
} from '@hubspot/ui-extensions-react';
import { CallingExtensions } from '@hubspot/calling-extensions-sdk';

// Flexfone Remote Calling Component
hubspot.extend(({ context, actions }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');
  const [currentCall, setCurrentCall] = useState(null);
  const [contactPhone, setContactPhone] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  const { crmObject } = useCrmObject();

  // Initialize Calling Extensions SDK
  useEffect(() => {
    const initializeCallingSDK = async () => {
      try {
        await CallingExtensions.init({
          debug: true,
          onReady: () => {
            console.log('Calling Extensions SDK ready');
            setIsConnected(true);
          },
          onCallStart: (callData) => {
            console.log('Call started:', callData);
            setCurrentCall(callData);
            setCallStatus('connected');
          },
          onCallEnd: (callData) => {
            console.log('Call ended:', callData);
            setCallStatus('idle');
            setCurrentCall(null);
          },
          onIncomingCall: (callData) => {
            console.log('Incoming call:', callData);
            setCurrentCall(callData);
            setCallStatus('incoming');
          }
        });
      } catch (error) {
        console.error('Error initializing Calling SDK:', error);
      }
    };

    initializeCallingSDK();
  }, []);

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
      // Use Calling Extensions SDK to make call
      await CallingExtensions.outgoingCall({
        phoneNumber: contactPhone,
        contactId: crmObject?.id,
        callType: 'outbound'
      });
      
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
      // Use Calling Extensions SDK to end call
      await CallingExtensions.endCall(currentCall.id);
      
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

  // Answer incoming call
  const handleAnswerCall = async () => {
    if (!currentCall) return;
    
    try {
      await CallingExtensions.answerCall(currentCall.id);
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
      await CallingExtensions.rejectCall(currentCall.id);
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
    <Card>
      <div style={{ padding: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Text variant="heading" style={{ marginRight: '8px' }}>
            Flexfone Remote Calling
          </Text>
          <Badge variant={isConnected ? 'success' : 'default'}>
            {isConnected ? 'Tilsluttet' : 'Ikke tilsluttet'}
          </Badge>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div style={{ marginBottom: '16px' }}>
            <Button
              onClick={initializeFlexfone}
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? 'Forbinder...' : 'Forbind til Flexfone'}
            </Button>
          </div>
        )}

        {/* Contact Info */}
        {contactPhone && (
          <div style={{ marginBottom: '16px' }}>
            <Text variant="body" style={{ marginBottom: '4px' }}>
              Telefonnummer: {contactPhone}
            </Text>
          </div>
        )}

        {/* Call Controls */}
        {isConnected && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
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
        )}

        {/* Call Info */}
        {currentCall && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <Text variant="body" style={{ marginBottom: '8px', fontWeight: 'bold' }}>
              Aktive opkald:
            </Text>
            <div>Fra: {currentCall.fromNumber}</div>
            <div>Til: {currentCall.toNumber}</div>
            <div>Type: {currentCall.type}</div>
            {currentCall.duration && (
              <div>Varighed: {currentCall.duration}s</div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
});
