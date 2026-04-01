<template>
  <div class="load-calculator glass-card">
    <!-- Step Progress -->
    <div class="calculator-steps">
      <div v-for="step in 5" :key="step" :class="['step-indicator', { active: currentStep >= step, current: currentStep === step }]">
        <span class="step-num">{{ step }}</span>
      </div>
    </div>

    <!-- Step 1: Appliance Entry -->
    <div v-if="currentStep === 1" class="step-content animate-in">
      <h2 class="step-title">Step 1: <span class="grad-blue">Appliance Entry</span></h2>
      <p class="step-desc">Add the appliances you want to power with your system.</p>

      <div class="appliance-form">
        <div class="form-group preset-group">
          <label>Select Appliance</label>
          <select v-model="selectedAppliance" @change="handlePresetSelect">
            <option value="">-- Choose from list --</option>
            <option v-for="item in applianceLibrary" :key="item.id" :value="item">{{ item.name }}</option>
            <option value="custom">Manual Entry</option>
          </select>
        </div>
        <div class="form-group name-group">
          <label>Appliance Name</label>
          <input type="text" v-model="entryName" placeholder="e.g. Living Room TV" :disabled="selectedAppliance !== 'custom' && selectedAppliance !== ''" />
        </div>
        <div class="form-group watt-group">
          <label>Wattage (W)</label>
          <div class="input-with-hint">
            <input type="number" v-model.number="entryWattage" placeholder="0" />
            <small v-if="selectedAppliance && selectedAppliance !== 'custom'" class="hint">Avg: {{ selectedAppliance.wattage }}W</small>
          </div>
        </div>
        <div class="form-group qty-group">
          <label>Qty</label>
          <input type="number" v-model.number="entryQuantity" min="1" />
        </div>
        <div class="form-group btn-group">
          <button class="btn btn-primary add-btn" @click="addAppliance" :disabled="!entryName || !entryWattage">
            <PlusIcon class="icon-sm" /> Add Appliance
          </button>
        </div>
      </div>

      <div class="added-appliances" v-if="appliances.length > 0">
        <h3>Current Load List</h3>
        <div class="appliance-list-wrapper">
          <table class="appliance-table">
            <thead>
              <tr>
                <th>Appliance</th>
                <th>Watts</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(app, index) in appliances" :key="index">
                <td data-label="Appliance">{{ app.name }}</td>
                <td data-label="Watts">{{ app.wattage }}W</td>
                <td data-label="Qty">{{ app.quantity }}</td>
                <td data-label="Total">{{ app.wattage * app.quantity }}W</td>
                <td>
                  <button class="remove-btn" @click="removeAppliance(index)">
                    <TrashIcon class="icon-xs" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="load-summary">
          <span>Total Watts: <strong>{{ totalWatts }}W</strong></span>
        </div>
      </div>

      <div class="step-actions">
        <button class="btn btn-primary next-btn" :disabled="appliances.length === 0" @click="nextStep">
          Continue to Calculations <ArrowRightIcon class="icon-sm" />
        </button>
      </div>
    </div>

    <!-- Step 2: System Calculations -->
    <div v-if="currentStep === 2" class="step-content animate-in text-center">
      <h2 class="step-title">Step 2: <span class="grad-blue">System Recommendation</span></h2>
      <div class="calculation-grid">
        <div class="calc-card">
          <ZapIcon class="calc-icon grad-orange" />
          <h4>Total Load</h4>
          <div class="calc-value">{{ totalWatts }}W</div>
        </div>
        <div class="calc-card primary">
          <InverterIcon class="calc-icon grad-blue" />
          <h4>Recommended Inverter</h4>
          <div class="calc-value">{{ recommendedInverter }}kVA</div>
          <p class="calc-note">Includes 20% safety margin & surge consideration.</p>
        </div>
        <div class="calc-card">
          <ActivityIcon class="calc-icon" />
          <h4>Estimated Surge</h4>
          <div class="calc-value">{{ estimatedSurge }}W</div>
        </div>
      </div>
      <div class="step-actions">
        <button class="btn btn-glass" @click="prevStep">Back</button>
        <button class="btn btn-primary" @click="nextStep">Define Backup <ArrowRightIcon class="icon-sm" /></button>
      </div>
    </div>

    <!-- Step 3: Battery Backup -->
    <div v-if="currentStep === 3" class="step-content animate-in">
      <h2 class="step-title">Step 3: <span class="grad-blue">Battery Backup</span></h2>
      <p class="step-desc">How many hours of backup do you need for your total load?</p>
      
      <div class="options-grid">
        <div v-for="option in backupOptions" :key="option.value" 
             :class="['option-card', { selected: backupHours === option.value }]"
             @click="selectBackup(option.value)">
          <div class="option-label">{{ option.label }}</div>
          <ClockIcon class="option-icon" />
        </div>
        <div :class="['option-card custom', { selected: isCustomBackup }]" @click="setCustomBackup">
          <div class="option-label">Custom</div>
          <input v-if="isCustomBackup" type="number" v-model.number="customHours" @click.stop placeholder="Hours" class="custom-input" />
          <SettingsIcon v-else class="option-icon" />
        </div>
      </div>

      <div class="calculation-preview" v-if="batteryCapacityKWh > 0">
        <div class="preview-item">
          <label>Required Capacity:</label>
          <span>{{ batteryCapacityKWh.toFixed(2) }} kWh</span>
        </div>
        <div class="preview-item">
          <label>Recommendation:</label>
          <span>{{ batteryConfig }}</span>
        </div>
      </div>

      <div class="step-actions">
        <button class="btn btn-glass" @click="prevStep">Back</button>
        <button class="btn btn-primary" @click="nextStep">Charging Speed <ArrowRightIcon class="icon-sm" /></button>
      </div>
    </div>

    <!-- Step 4: Solar Charging -->
    <div v-if="currentStep === 4" class="step-content animate-in">
      <h2 class="step-title">Step 4: <span class="grad-blue">Charging Speed</span></h2>
      <p class="step-desc">How fast should your batteries recharge via solar energy?</p>

      <div class="options-grid horizontal">
        <div v-for="speed in chargeSpeeds" :key="speed.id"
             :class="['option-card wide', { selected: chargeSpeed === speed.id }]"
             @click="chargeSpeed = speed.id">
          <div class="option-meta">
            <span class="option-label">{{ speed.label }}</span>
            <span class="option-sub">{{ speed.desc }}</span>
          </div>
          <component :is="speed.icon" class="option-icon" />
        </div>
      </div>

      <div class="calculation-preview" v-if="solarCapacityKW > 0">
        <div class="preview-item">
          <label>Required Solar:</label>
          <span>{{ solarCapacityKW.toFixed(2) }} kW</span>
        </div>
        <div class="preview-item">
          <label>Panels (450W):</label>
          <span>{{ Math.ceil(solarCapacityKW * 1000 / 450) }} Panels</span>
        </div>
      </div>

      <div class="step-actions">
        <button class="btn btn-glass" @click="prevStep">Back</button>
        <button class="btn btn-primary" @click="nextStep">View Results <ArrowRightIcon class="icon-sm" /></button>
      </div>
    </div>

    <!-- Step 5: Final Result -->
    <div v-if="currentStep === 5" class="step-content animate-in pb-xl">
      <h2 class="step-title">Final <span class="grad-orange">Energy Blueprint</span></h2>
      
      <div class="result-summary">
        <div class="result-main-card glass-card">
          <div class="result-header">
            <h3>Calculated Recommendation</h3>
            <span class="badge blue">Premium Grade</span>
          </div>
          
          <div class="result-grid">
            <div class="result-item">
              <ZapIcon class="res-icon" />
              <div>
                <label>Total Load</label>
                <strong>{{ totalWatts }} Watts</strong>
              </div>
            </div>
            <div class="result-item">
              <InverterIcon class="res-icon" />
              <div>
                <label>Inverter Size</label>
                <strong>{{ recommendedInverter }} kVA</strong>
              </div>
            </div>
            <div class="result-item">
              <BatteryIcon class="res-icon" />
              <div>
                <label>Battery Storage</label>
                <strong>{{ batteryCapacityKWh.toFixed(1) }} kWh</strong>
                <small>{{ batteryConfig }}</small>
              </div>
            </div>
            <div class="result-item">
              <SunIcon class="res-icon" />
              <div>
                <label>Solar Array</label>
                <strong>{{ solarCapacityKW.toFixed(2) }} kW</strong>
                <small>{{ Math.ceil(solarCapacityKW * 1000 / config.specs.panel_wattage) }} x {{ config.specs.panel_wattage }}W Panels</small>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="cost-range">
            <label>Estimated Cost Range</label>
            <div class="price">₦{{ formatPrice(minCost) }} - ₦{{ formatPrice(maxCost) }}</div>
            <p class="cost-disclaimer">Price includes professional installation, cabling, and 5-year warranty on core components.</p>
          </div>
        </div>

        <div class="cta-section">
          <button class="btn btn-secondary btn-lg btn-block" @click="requestInstallation">
             Request Instant Installation
          </button>
          <button class="btn btn-glass btn-lg btn-block" @click="currentStep = 1">
            Recalculate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  Plus as PlusIcon, 
  Trash2 as TrashIcon, 
  ArrowRight as ArrowRightIcon,
  Zap as ZapIcon,
  Cpu as InverterIcon,
  Activity as ActivityIcon,
  Clock as ClockIcon,
  Settings as SettingsIcon,
  Sun as SunIcon,
  Battery as BatteryIcon,
  BatteryCharging as NormalChargeIcon,
  Zap as FastChargeIcon,
  Flame as VeryFastChargeIcon
} from 'lucide-vue-next';
import applianceService from '../services/appliance.service';
import settingsService from '../services/settings.service';

// State
const currentStep = ref(1);
const appliances = ref([]); // User's added appliances
const applianceLibrary = ref([]); // Data from backend
const selectedAppliance = ref('');
const entryName = ref('');
const entryWattage = ref(null);
const entryQuantity = ref(1);

const backupHours = ref(10);
const isCustomBackup = ref(false);
const customHours = ref(null);

const chargeSpeed = ref('normal');

const config = ref({
  pricing: {
    inverter_cost_per_kva: 150000,
    battery_cost_per_kwh: 180000,
    solar_cost_per_kw: 250000
  },
  engineering: {
    safety_margin: 1.2,
    power_factor: 0.8,
    peak_sun_hours: 4.5
  },
  specs: {
    panel_wattage: 450,
    battery_dod: 0.8,
    battery_efficiency: 0.85,
    battery_ah: 200
  },
  thresholds: {
    voltage_12v_max: 1.5,
    voltage_24v_max: 3.5,
    margin_percentage: 15,
    max_margin_cap: 500000
  }
});

const fetchConfig = async () => {
  try {
    const [configData, appData] = await Promise.all([
      settingsService.getSetting('load_audit_config'),
      applianceService.getAppliances()
    ]);
    
    if (configData) config.value = configData;
    if (appData) applianceLibrary.value = appData;
  } catch (err) {
    console.error('Failed to fetch load audit data:', err);
  }
};

onMounted(fetchConfig);

// Options
const backupOptions = [
  { label: '5 hrs', value: 5 },
  { label: '10 hrs', value: 10 },
  { label: '12 hrs', value: 12 },
  { label: '20 hrs', value: 20 },
];

const chargeSpeeds = [
  { id: 'normal', label: 'Normal', desc: '8-10 Hours Charge', icon: NormalChargeIcon, mult: 1 },
  { id: 'fast', label: 'Fast', desc: '4-6 Hours Charge', icon: FastChargeIcon, mult: 1.5 },
  { id: 'very-fast', label: 'Very Fast', desc: 'Solar Priority', icon: VeryFastChargeIcon, mult: 2 },
];

// Methods
const handlePresetSelect = () => {
  if (selectedAppliance.value && selectedAppliance.value !== 'custom') {
    entryName.value = selectedAppliance.value.name;
    entryWattage.value = selectedAppliance.value.wattage;
  } else {
    entryName.value = '';
    entryWattage.value = null;
  }
};

const addAppliance = () => {
  if (entryName.value && entryWattage.value > 0) {
    const surge = selectedAppliance.value?.surgeFactor || 1;
    appliances.value.push({
      name: entryName.value,
      wattage: entryWattage.value,
      quantity: entryQuantity.value,
      surgeFactor: surge
    });
    // Reset
    entryName.value = '';
    entryWattage.value = null;
    entryQuantity.value = 1;
    selectedAppliance.value = '';
  }
};

const removeAppliance = (index) => {
  appliances.value.splice(index, 1);
};

const nextStep = () => { 
  if (currentStep.value < 5) {
    currentStep.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
const prevStep = () => { 
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const selectBackup = (val) => {
  backupHours.value = val;
  isCustomBackup.value = false;
};

const setCustomBackup = () => {
  isCustomBackup.value = true;
};

const formatPrice = (num) => {
  return new Intl.NumberFormat('en-NG').format(Math.round(num));
};

const requestInstallation = () => {
  const phoneNumber = '2347041880339';
  
  let message = `*Origin Electric - Load Audit Results*\n\n`;
  
  message += `*Load Details:*\n`;
  appliances.value.forEach(app => {
    message += `- ${app.name}: ${app.wattage}W x ${app.quantity} = ${app.wattage * app.quantity}W\n`;
  });
  message += `\n*Total Load:* ${totalWatts.value}W\n`;
  
  message += `\n*System Recommendations:*\n`;
  message += `- Inverter: ${recommendedInverter.value}kVA\n`;
  message += `- Battery storage: ${batteryCapacityKWh.value.toFixed(1)}kWh (${batteryConfig.value})\n`;
  message += `- Solar array: ${solarCapacityKW.value.toFixed(2)}kW (${Math.ceil(solarCapacityKW.value * 1000 / config.value.specs.panel_wattage)} x ${config.value.specs.panel_wattage}W Panels)\n`;
  
  message += `\n*Estimated Cost Range:* ₦${formatPrice(minCost.value)} - ₦${formatPrice(maxCost.value)}\n\n`;
  
  message += `Please send me a detailed quotation including installation and warranty`;
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  window.open(whatsappUrl, '_blank');
};

// Calculations
const totalWatts = computed(() => {
  return appliances.value.reduce((sum, app) => sum + (app.wattage * app.quantity), 0);
});

const estimatedSurge = computed(() => {
  return appliances.value.reduce((sum, app) => sum + (app.wattage * app.quantity * (app.surgeFactor || 1)), 0);
});

const recommendedInverter = computed(() => {
  if (totalWatts.value === 0) return 0;
  // Rule: (Total Watts * safety margin) / Power Factor
  const va = (totalWatts.value * config.value.engineering.safety_margin) / config.value.engineering.power_factor;
  const kva = va / 1000;
  
  // Standard sizes: 1, 1.5, 2.5, 3.5, 5, 7.5, 10, 15...
  const standards = [1, 1.5, 2.5, 3.5, 5, 7.5, 10, 15, 20, 30];
  return standards.find(s => s >= kva) || Math.ceil(kva);
});

const effectiveBackupHours = computed(() => {
  return isCustomBackup.value ? (customHours.value || 0) : backupHours.value;
});

const batteryCapacityKWh = computed(() => {
  // kWh = (Watts * Hours) / (Efficiency * DoD)
  if (totalWatts.value === 0) return 0;
  return (totalWatts.value * effectiveBackupHours.value / 1000) / (config.value.specs.battery_efficiency * config.value.specs.battery_dod);
});

const batteryConfig = computed(() => {
  if (batteryCapacityKWh.value === 0) return '-';
  
  const voltage = recommendedInverter.value >= config.value.thresholds.voltage_24v_max 
    ? '48V' 
    : (recommendedInverter.value >= config.value.thresholds.voltage_12v_max ? '24V' : '12V');
    
  const vNum = parseInt(voltage);
  const totalAhAtVoltage = (batteryCapacityKWh.value * 1000) / vNum;
  const ahPerBattery = config.value.specs.battery_ah;
  
  if (voltage === '48V') {
     const chains = Math.ceil(totalAhAtVoltage / ahPerBattery);
     return `48V ${ahPerBattery}Ah Bank (${chains * 4} Batteries)`;
  } else if (voltage === '24V') {
     const chains = Math.ceil(totalAhAtVoltage / ahPerBattery);
     return `24V ${ahPerBattery}Ah Bank (${chains * 2} Batteries)`;
  } else {
     const num = Math.ceil(totalAhAtVoltage / ahPerBattery);
     return `12V ${ahPerBattery}Ah (${num} Batteries)`;
  }
});

const solarCapacityKW = computed(() => {
  // replenish battery in peak sun hours * speed multiplier
  const mult = chargeSpeeds.find(s => s.id === chargeSpeed.value)?.mult || 1;
  return (batteryCapacityKWh.value / config.value.engineering.peak_sun_hours) * mult;
});

// Cost Estimation Logic
const minCost = computed(() => {
  if (totalWatts.value === 0) return 0;
  const { pricing } = config.value;
  return (recommendedInverter.value * pricing.inverter_cost_per_kva) + 
         (batteryCapacityKWh.value * pricing.battery_cost_per_kwh) + 
         (solarCapacityKW.value * pricing.solar_cost_per_kw);
});
const maxCost = computed(() => {
  if (minCost.value === 0) return 0;
  const marginPercent = config.value.thresholds.margin_percentage / 100;
  const margin = Math.min(minCost.value * marginPercent, config.value.thresholds.max_margin_cap);
  return minCost.value + margin;
});

</script>

<style scoped>
.load-calculator {
  max-width: 900px;
  margin: 0 auto;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .load-calculator {
    padding: var(--space-sm);
    box-shadow: none;
    background: transparent;
    border: none;
  }
}

/* Step Indicators */
.calculator-steps {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
}


.step-indicator {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
  font-weight: 700;
  transition: all 0.3s ease;
  position: relative;
  font-size: 0.9rem;
}

@media (max-width: 576px) {
  .step-indicator {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}

.step-indicator.active {
  background: var(--color-blue-light);
  border-color: var(--color-blue-primary);
  color: var(--color-blue-primary);
}

.step-indicator.current {
  background: var(--color-blue-primary);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(0, 102, 204, 0.3);
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.animate-in {
  animation: slideUp 0.5s var(--transition-bounce) forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-title {
  font-size: 2rem;
  margin-bottom: var(--space-xs);
  line-height: 1.2;
}

@media (max-width: 768px) {
  .step-title {
    font-size: 1.25rem;
  }
}

.step-desc {
  margin-bottom: var(--space-md);
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Forms */
.appliance-form {
  background: var(--bg-secondary);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  align-items: flex-end;
}

.preset-group, .name-group { grid-column: span 1; }
.watt-group, .qty-group { grid-column: span 1; }
.btn-group { grid-column: span 2; display: flex; justify-content: center; }

@media (max-width: 768px) {
  .appliance-form {
    grid-template-columns: 1fr;
    padding: var(--space-sm);
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }
  .preset-group, .name-group, .watt-group, .qty-group, .btn-group { 
    grid-column: span 1; 
  }
}

.input-with-hint {
  position: relative;
  display: flex;
  flex-direction: column;
}

.hint { 
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  font-size: 0.75rem; 
  color: var(--color-blue-primary); 
  font-weight: 600;
  white-space: nowrap;
  background: var(--bg-secondary); /* Cover border if needed */
  padding: 0 4px;
}

@media (max-width: 768px) {
  .hint { 
    position: static; 
    margin-top: 0; 
    white-space: normal;
  }
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.small { flex: 0.3; }

label {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input, select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s;
}

input:disabled, select:disabled {
  background: var(--bg-secondary);
  opacity: 0.6;
  cursor: not-allowed;
}

input::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

option {
  background: var(--bg-primary);
  color: var(--text-primary);
}

input:focus, select:focus {
  outline: none;
  border-color: var(--color-blue-primary);
  box-shadow: 0 0 0 3px var(--color-blue-light);
}

.hint { font-size: 0.75rem; color: var(--color-blue-primary); font-weight: 600; }

.add-btn { height: 48px; border-radius: var(--radius-sm); padding: 0 2rem; }

/* Table */
.added-appliances h3 { font-size: 1.25rem; margin-bottom: var(--space-sm); }

.appliance-list-wrapper {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-sm);
  background: var(--bg-primary);
}

.appliance-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

@media (max-width: 600px) {
  .appliance-table thead { display: none; }
  .appliance-table tr { 
    display: block; 
    padding: var(--space-sm); 
    border-bottom: 2px solid var(--border-color);
    position: relative;
    padding-right: var(--space-xl); /* Make room for absolute positioned button */
  }
  .appliance-table td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border: none;
    font-size: 0.9rem;
  }
  .appliance-table td:last-child {
    padding: 0;
    height: 0;
    overflow: visible;
  }
  .appliance-table td::before {
    content: attr(data-label);
    font-weight: 700;
    color: var(--text-primary);
  }
  .remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 5;
    background: var(--bg-primary);
    box-shadow: var(--shadow-sm);
  }
}

.appliance-table th, .appliance-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.appliance-table th { background: var(--bg-secondary); font-size: 0.8rem; }

.remove-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.remove-btn:hover { background: #fee2e2; }

.load-summary {
  background: var(--color-blue-light);
  padding: 1rem;
  border-radius: var(--radius-sm);
  text-align: right;
  font-size: 1.1rem;
}

/* Step 2 Calc Cards */
.calculation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
  margin: var(--space-md) 0;
}

.calc-card {
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.calc-card.primary {
  background: var(--bg-primary);
  border: 2px solid var(--color-blue-primary);
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
  z-index: 2;
}

@media (max-width: 768px) {
  .calculation-grid {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
  .calc-card.primary {
    transform: none;
    order: -1; /* Recommended inverter first on mobile */
  }
}

.calc-icon { width: 40px; height: 40px; }
.calc-value { font-size: 2.5rem; font-weight: 900; color: var(--text-primary); }
.calc-note { font-size: 0.8rem; color: var(--text-secondary); }

/* Step 3 & 4 Options */
.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: var(--space-sm);
  margin: var(--space-md) 0;
}

.options-grid.horizontal {
    grid-template-columns: 1fr;
}

.option-card {
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  padding: var(--space-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s;
  text-align: center;
}

@media (max-width: 576px) {
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .option-card {
    padding: 1rem;
  }
  .option-label { font-size: 1rem; }
}

.option-card.wide {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
}

@media (max-width: 576px) {
  .option-card.wide {
    gap: 12px;
  }
}

.option-card:hover { border-color: var(--color-blue-light); background: var(--bg-primary); }

.option-card.selected {
  background: var(--color-blue-light);
  border-color: var(--color-blue-primary);
  color: var(--color-blue-primary);
}

.option-icon { width: 32px; height: 32px; opacity: 0.7; }
.option-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.option-label { font-weight: 800; font-size: 1.1rem; }
.option-sub { font-size: 0.85rem; opacity: 0.7; }

.custom-input { width: 80px; text-align: center; }

.calculation-preview {
  background: var(--bg-secondary);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-top: var(--space-sm);
}

.preview-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

@media (max-width: 576px) {
  .preview-item {
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }
}

.preview-item:last-child { border-bottom: none; }
.preview-item label { color: var(--text-secondary); }
.preview-item span { font-weight: 800; color: var(--text-primary); }

/* Results */
.result-main-card {
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
  border-top: 5px solid var(--color-orange-primary);
}

.result-summary {
  margin-bottom: var(--space-xl);
}

@media (max-width: 768px) {
  .result-main-card {
    padding: var(--space-md);
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

@media (max-width: 576px) {
  .result-header {
    flex-direction: column;
    gap: var(--space-sm);
    text-align: center;
    align-items: center;
  }
}

.badge {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}
.badge.blue { background: var(--color-blue-light); color: var(--color-blue-primary); }

.result-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

@media (max-width: 576px) { .result-grid { grid-template-columns: 1fr; } }

.result-item {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.res-icon { width: 24px; height: 24px; color: var(--color-blue-primary); flex-shrink: 0; }
.result-item label { font-size: 0.75rem; display: block; margin-bottom: 2px; }
.result-item strong { font-size: 1.25rem; color: var(--text-primary); display: block; }
.result-item small { display: block; color: var(--text-secondary); margin-top: 2px; }

.divider { height: 1px; background: var(--border-color); margin: var(--space-md) 0; }

.cost-range { text-align: center; }
.cost-range .price { font-size: clamp(1.75rem, 5vw, 2.5rem); font-weight: 900; color: var(--color-blue-primary); margin: 10px 0; }

@media (max-width: 576px) {
  .cost-range .price {
    font-size: 1.5rem;
  }
}
.cost-disclaimer { font-size: 0.8rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto; line-height: 1.4; }

.cta-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.step-actions {
  margin-top: auto;
  padding-top: var(--space-md);
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
}

@media (max-width: 576px) {
  .step-actions {
    flex-direction: column;
  }
  .step-actions .btn {
    width: 100%;
  }
  .next-btn { order: -1; } /* Primary action first on mobile */
}

.next-btn { margin-left: auto; }
.btn-block { width: 100%; }

.icon-xs { width: 14px; height: 14px; }
</style>
