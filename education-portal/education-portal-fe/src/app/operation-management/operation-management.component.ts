import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-operation-management',
  standalone: true,
  imports: [NzTabsModule, NzSelectModule, FormsModule],
  templateUrl: './operation-management.component.html',
  styleUrl: './operation-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationManagementComponent {
  readonly reportChartOptions = [
    '8 States',
    'PBI-ND',
    'PBI-WV',
    'PBI-SC',
    'PBI-NH',
    'PBI-ME',
    'PBI-AK',
  ];
  currentVisibleChart = this.reportChartOptions[0];
}
