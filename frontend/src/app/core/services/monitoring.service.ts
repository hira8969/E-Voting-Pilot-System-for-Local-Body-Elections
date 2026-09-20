import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ServiceHealth, KafkaTopicMetric, CassandraNodeMetric } from '../models/system.model';
import { MOCK_SERVICES_HEALTH, MOCK_KAFKA_METRICS, MOCK_CASSANDRA_NODES } from '../mock-data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private services: ServiceHealth[] = [...MOCK_SERVICES_HEALTH];
  private kafkaMetrics: KafkaTopicMetric[] = [...MOCK_KAFKA_METRICS];
  private cassandraNodes: CassandraNodeMetric[] = [...MOCK_CASSANDRA_NODES];

  getServicesHealth(): Observable<ServiceHealth[]> {
    return of(this.services).pipe(delay(200));
  }

  getKafkaMetrics(): Observable<KafkaTopicMetric[]> {
    return of(this.kafkaMetrics).pipe(delay(200));
  }

  getCassandraNodes(): Observable<CassandraNodeMetric[]> {
    return of(this.cassandraNodes).pipe(delay(200));
  }
}
