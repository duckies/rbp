import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class TestGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('test')
  test(client: Socket, data: string): string {
    console.table(data);
    console.table(client);
    return 'Test successful';
  }
}
