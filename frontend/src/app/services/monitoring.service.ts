import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ServiceHealth } from '../models/system.model';
import { MOCK_SERVICES_HEALTH } from '../mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private services: ServiceHealth[] = [...MOCK_SERVICES_HEALTH];

  getServicesHealth(): Observable<ServiceHealth[]> {
    return of(this.services).pipe(delay(200));
  }
}

