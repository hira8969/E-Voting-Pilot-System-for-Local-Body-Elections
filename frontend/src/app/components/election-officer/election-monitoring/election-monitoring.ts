import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusIndicatorComponent } from '../../status-indicator/status-indicator';
import { AppIconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-election-monitoring',
  standalone: true,
  imports: [CommonModule, StatusIndicatorComponent, AppIconComponent],
  templateUrl: './election-monitoring.html',
  styleUrl: './election-monitoring.css'
})
export class ElectionMonitoringComponent {
  hourlyData = [
    { time: '07 AM', votes: 1240 },
    { time: '08 AM', votes: 2890 },
    { time: '09 AM', votes: 4120 },
    { time: '10 AM', votes: 4820 },
    { time: '11 AM', votes: 4610 },
    { time: '12 PM', votes: 3450 },
    { time: '01 PM', votes: 2190 },
    { time: '02 PM', votes: 2840 },
    { time: '03 PM', votes: 3290 },
    { time: '04 PM', votes: 2971 },
    { time: '05 PM', votes: 0 }
  ];

  liveEvents = [
    { id: '1', time: '11:32:01', type: 'VOTE_BLOCK_COMMITTED', message: 'EVM-IN-88902 securely submitted block hash SHA-256' },
    { id: '2', time: '11:31:54', type: 'BOOTH_TELEMETRY', message: 'PB-12-04 reported 78% battery, ping 21ms' },
    { id: '3', time: '11:31:40', type: 'VOTER_AUTH_OTP', message: 'EPIC verification handshake completed for Ward 12' },
    { id: '4', time: '11:31:12', type: 'KAFKA_BROKER_SYNC', message: 'Topic evm.vote.cast.events partition lag = 0' }
  ];
}
