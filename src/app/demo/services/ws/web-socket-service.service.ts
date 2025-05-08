import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private messages$ = new Subject<any>();
  private isConnected = false;
  private wsUrl = environment.wsUrl
  connect(room: string): void {
    if (this.isConnected) {
      console.log('🔄 WebSocket already connected.');
      return;
    }

    // Create a new WebSocket connection to the specified room
    this.socket = new WebSocket(`${this.wsUrl}/api/v1/ws/${room}`);
    // On connection open
    this.socket.onopen = () => {
      console.log('✅ WebSocket connected to room:', room);
      this.isConnected = true;
    };

    // On message received
    this.socket.onmessage = (event: MessageEvent) => {
      console.log('📩 Message received:', event.data);
      this.messages$.next(event.data);  // Emit the received message
    };

    // On WebSocket error
    this.socket.onerror = (error: Event) => {
      console.error('❌ WebSocket Error:', error);
    };

    // On WebSocket close
    this.socket.onclose = (event: CloseEvent) => {
      console.warn('🔌 WebSocket closed:', event);
      this.isConnected = false;
    };
  }

  // Send a message to the WebSocket server
  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('❌ Error sending message:', error);
      }
    } else {
      console.warn('⚠️ WebSocket is not open. Message not sent.');
    }
  }

  // Get received messages as an Observable
  getMessages(): Observable<any> {
    return this.messages$.asObservable();
  }

  getJsonMessage(): Observable<any> {
    return new Observable((observer) => {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data); 
            observer.next(message);
        };
    });
}


  // Close the WebSocket connection
  close(): void {
    if (this.socket && this.isConnected) {
      this.socket.close();
      console.log('🔒 WebSocket connection closed.');
    }
  }
}