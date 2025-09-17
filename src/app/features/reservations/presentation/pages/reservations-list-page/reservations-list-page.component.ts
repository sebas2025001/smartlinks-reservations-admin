import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationsFacade } from '@features/reservations/application/facades/reservations.facade';
import { ReservationBase, ReservationStatus, PaymentStatus } from '@shared/domain/models/reservation-base.model';

// PrimeNG Imports for notifications
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-reservations-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    TagModule,
    InputTextModule
  ],
  templateUrl: './reservations-list-page.component.html',
  styleUrls: ['./reservations-list-page.component.scss']
})
export class ReservationsListPageComponent implements OnInit {
  private facade = inject(ReservationsFacade);
  private router = inject(Router);
  private messageService = inject(MessageService);

  reservations$ = this.facade.reservations$;
  loading$ = this.facade.loading$;
  pagination$ = this.facade.pagination$;

  // Component state
  exporting = false;
  searchTerm = '';
  selectedPaymentStatus: any = null;
  selectedReservationStatus: any = null;
  pageSize = 10;
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedReservations: ReservationBase[] = [];

  // Dropdown options
  paymentStatusOptions = [
    { label: 'Todos', value: null },
    { label: 'Pago Pendiente', value: 'PENDING' },
    { label: 'Pago Exitoso', value: 'COMPLETED' },
    { label: 'Pago Fallido', value: 'FAILED' }
  ];

  reservationStatusOptions = [
    { label: 'Todos', value: null },
    { label: 'Confirmada', value: 'CONFIRMED' },
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'Cancelada', value: 'CANCELLED' }
  ];

  pageSizeOptions = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 }
  ];


  ngOnInit(): void {
    this.loadReservations();
  }

  private loadReservations(): void {
    this.facade.load();
  }

  onSearchChange(): void {
    this.onFiltersChange();
  }

  onFiltersChange(): void {
    // Apply filters logic here
    this.facade.search(this.searchTerm);
  }

  onPageSizeChange(): void {
    this.facade.changePageSize(this.pageSize);
  }

  onViewReservation(reservation: ReservationBase): void {
    this.router.navigate(['/reservas', reservation.id]);
  }

  onRefresh(): void {
    this.facade.refresh();
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Los datos han sido actualizados correctamente'
    });
  }

  async onExport(): Promise<void> {
    try {
      this.exporting = true;

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.messageService.add({
        severity: 'success',
        summary: 'Exportación Completada',
        detail: 'Los datos han sido exportados correctamente'
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de Exportación',
        detail: 'No se pudo exportar los datos'
      });
    } finally {
      this.exporting = false;
    }
  }

  // Formatting methods
  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }

  formatValue(reservation: ReservationBase): string {
    // Mock format similar to the reference image
    const amount = reservation.totalAmount;
    const currency = reservation.currency;
    
    if (currency === 'COP') {
      const miles = Math.floor(amount / 1000);
      const usd = Math.floor(amount / 4000);
      return `${miles} Millas Plus + $${usd}.00 USD`;
    }
    
    return `$${amount.toLocaleString()} ${currency}`;
  }

  // Status label methods
  getPaymentStatusLabel(status: PaymentStatus): string {
    const labels = {
      'PENDING': 'Pago Pendiente',
      'COMPLETED': 'Pago Exitoso',
      'FAILED': 'Pago Fallido',
      'REFUNDED': 'Reembolsado'
    };
    return labels[status] || status;
  }

  getReservationStatusLabel(status: ReservationStatus): string {
    const labels = {
      'PENDING': 'Pago Pendiente',
      'CONFIRMED': 'Emitida',
      'CANCELLED': 'Cancelada',
      'COMPLETED': 'Completada',
      'EXPIRED': 'Expirada'
    };
    return labels[status] || status;
  }

  getPaymentStatusSeverity(status: PaymentStatus): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    const severityMap = {
      'COMPLETED': 'success' as const,
      'PENDING': 'warning' as const,
      'FAILED': 'danger' as const,
      'REFUNDED': 'info' as const
    };
    return severityMap[status] || 'secondary';
  }

  getReservationStatusSeverity(status: ReservationStatus): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    const severityMap = {
      'CONFIRMED': 'info' as const,
      'PENDING': 'warning' as const,
      'CANCELLED': 'danger' as const,
      'COMPLETED': 'success' as const,
      'EXPIRED': 'secondary' as const
    };
    return severityMap[status] || 'secondary';
  }
}
    }

    const confirmedCount = reservations.filter(r => r.status === 'CONFIRMED').length;
    const pendingCount = reservations.filter(r => r.status === 'PENDING').length;

    return {
      totalReservations: reservations.length,
      confirmedReservations: confirmedCount,
      pendingReservations: pendingCount,
      showTrends: false // Could be enhanced with trends calculation
    };
  }

  private cancelReservation(reservation: ReservationBase): void {
    this.facade.cancel(reservation.id);
    this.messageService.add({
      severity: 'warn',
      summary: 'Reserva Cancelada',
      detail: `La reserva ${reservation.pnr} ha sido cancelada`
    });
  }

  private duplicateReservation(reservation: ReservationBase): void {
    // TODO: Implement duplication logic
    this.messageService.add({
      severity: 'info',
      summary: 'Duplicación Pendiente',
      detail: 'La funcionalidad de duplicación será implementada próximamente'
    });
  }
}
