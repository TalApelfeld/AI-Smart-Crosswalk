import { useState, useEffect } from 'react';
import {
  Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter,
  Button, Input, Select, Badge
} from './ui';
import { GenericDetailCard } from './ItemCard';
import { formatId, formatStatus } from '../utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getNestedValue = (obj, key) =>
  key.split('.').reduce((acc, k) => acc?.[k], obj) ?? '';

// ─── useFormState ─────────────────────────────────────────────────────────────
// Shared hook for flat/nested form state.

export function useFormState(initialFn, item, open) {
  const [formData, setFormData] = useState(() => initialFn(item));
  useEffect(() => setFormData(initialFn(item)), [item, open]);

  const handleFieldChange = (key, value) => {
    const parts = key.split('.');
    setFormData(prev =>
      parts.length === 1
        ? { ...prev, [key]: value }
        : { ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: value } }
    );
  };
  return [formData, handleFieldChange];
}

// ─── useTabState — internal ───────────────────────────────────────────────────

function useTabState(tabsConfig, item, open) {
  const [activeTab, setActiveTab] = useState('');
  const [state, setState] = useState({});

  useEffect(() => {
    if (!item || !tabsConfig) return;
    setState(Object.fromEntries(tabsConfig.tabs.map(tab => [
      tab.id,
      tab.type === 'form'   ? (tab.initState?.(item) ?? {}) :
      tab.type === 'device' ? { selected: item[tab.deviceKey]?._id || '' } : {},
    ])));
    setActiveTab(tabsConfig.tabs[0]?.id || '');
  }, [item, open]);

  const setTabField = (tabId, key, value) =>
    setState(prev => ({ ...prev, [tabId]: { ...prev[tabId], [key]: value } }));

  return { activeTab, setActiveTab, state, setTabField };
}

// ─── renderField — internal ───────────────────────────────────────────────────

function renderField(field, j, formData, onFieldChange) {
  const shared = { label: field.label, value: getNestedValue(formData, field.key), onChange: v => onFieldChange?.(field.key, v), placeholder: field.placeholder, required: field.required, disabled: field.disabled };
  return (
    <div key={j}>
      {field.type === 'select' ? <Select {...shared} options={field.options || []} /> : <Input {...shared} type={field.inputType || 'text'} />}
      {field.hint && <p className="text-xs text-surface-500 mt-1">{field.hint}</p>}
    </div>
  );
}

// ─── FormDialog — internal renderer ──────────────────────────────────────────

function FormDialog({
  open, onClose, onSubmit, title, description,
  sections, formData, onFieldChange,
  loading = false, submitText, cancelText = 'Cancel',
  maxWidth = 'max-w-md',
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth}>
      <form onSubmit={onSubmit}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {description && <p className="text-sm text-surface-600 mb-4">{description}</p>}
          <div className="space-y-6">
            {sections.map((s, i) => (
              <div key={i}>
                {s.title && <h4 className="text-lg font-semibold text-surface-900 mb-3">{s.title}</h4>}
                {s.fields ? <div className="space-y-3">{s.fields.map((f, j) => renderField(f, j, formData, onFieldChange))}</div> : s.content}
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>{cancelText}</Button>
          <Button type="submit" variant="primary" loading={loading}>{submitText || 'Submit'}</Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

// ─── TabDialog — internal renderer ───────────────────────────────────────────

function TabDialog({ tabsConfig, item, open, onClose, loading, context }) {
  const { activeTab, setActiveTab, state, setTabField } = useTabState(tabsConfig, item, open);
  if (!item || !tabsConfig) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{tabsConfig.title}</DialogTitle>
        {tabsConfig.getSubtitle && (
          <p className="text-sm text-surface-500 mt-1">{tabsConfig.getSubtitle(item)}</p>
        )}
      </DialogHeader>

      <DialogContent>
        {/* Tab bar */}
        <div className="flex border-b border-surface-200 mb-6">
          {tabsConfig.tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-none border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab content */}
        {tabsConfig.tabs.map((tab) => {
          if (tab.id !== activeTab) return null;
          const tabState = state[tab.id] || {};

          if (tab.type === 'form') return (
            <div key={tab.id} className="space-y-4">
              {tab.sectionTitle && <h4 className="text-md font-semibold text-surface-900">{tab.sectionTitle}</h4>}
              {tab.formFields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  value={tabState[field.key] ?? ''}
                  onChange={(v) => setTabField(tab.id, field.key, v)}
                  required={field.required}
                />
              ))}
              <Button variant="primary" onClick={() => tab.onSubmit(item, tabState, context)} loading={loading}>
                {tab.submitLabel || 'Save'}
              </Button>
            </div>
          );

          if (tab.type === 'device') {
            const linked  = item[tab.deviceKey];
            const options = tab.getOptions?.(context) || [];
            return (
              <div key={tab.id} className="space-y-4">
                {tab.sectionTitle && <h4 className="text-md font-semibold text-surface-900">{tab.sectionTitle}</h4>}
                {linked && tab.getDeviceCard && (
                  <GenericDetailCard
                    {...tab.getDeviceCard(linked)}
                    actions={[{ label: '🔗 Unlink', onClick: () => tab.onUnlink(item, context), variant: 'danger', disabled: loading }]}
                  />
                )}
                <Select
                  label={tab.selectLabel || 'Select'}
                  value={tabState.selected || ''}
                  onChange={(v) => setTabField(tab.id, 'selected', v)}
                  options={options}
                  placeholder={tab.selectPlaceholder || 'Select...'}
                />
                <div className="flex gap-2">
                  <Button variant="primary" onClick={() => tab.onLink(item, tabState.selected, context)} disabled={!tabState.selected} loading={loading}>
                    {tab.linkLabel || '🔗 Link'}
                  </Button>
                  {tab.onCreate && (
                    <Button variant="ghost" onClick={() => tab.onCreate(context)}>
                      {tab.createLabel || '➕ Add New'}
                    </Button>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })}
      </DialogContent>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </DialogFooter>
    </Dialog>
  );
}

// ─── Dialog Config Registry ───────────────────────────────────────────────────
// One entry per type — pages use <ItemDialog type="..." /> without knowing the internals.
// Add a new dialog type here without touching any other file.

const STATUS_OPTIONS       = [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'error', label: 'Error' }];
const DANGER_LEVEL_OPTIONS = [{ value: 'LOW', label: 'Low' }, { value: 'MEDIUM', label: 'Medium' }, { value: 'HIGH', label: 'High' }];

const toOptions = {
  cameras:    (list) => list.map(c  => ({ value: c._id,  label: `Camera ${formatId(c._id)} - ${c.status}` })),
  leds:       (list) => list.map(l  => ({ value: l._id,  label: `LED ${formatId(l._id)}` })),
  crosswalks: (list) => list.map(cw => ({ value: cw._id, label: `${cw.location.city}, ${cw.location.street} ${cw.location.number}` })),
};

const sharedFields = {
  statusSelect:    { type: 'select', label: 'Status',       key: 'status',             options: STATUS_OPTIONS,       required: true },
  dangerLevel:     { type: 'select', label: 'Danger Level', key: 'dangerLevel',        options: DANGER_LEVEL_OPTIONS, required: true },
  photoUrl:        { type: 'input',  label: 'Photo URL',    key: 'detectionPhoto.url', inputType: 'url', placeholder: 'https://example.com/photo.jpg', required: true },
  locationCity:    { type: 'input',  label: 'City',         key: 'location.city',      placeholder: 'Tel Aviv',  required: true },
  locationStreet:  { type: 'input',  label: 'Street',       key: 'location.street',    placeholder: 'Dizengoff', required: true },
  locationNumber:  { type: 'input',  label: 'Number',       key: 'location.number',    placeholder: '50',        required: true },
  cameraSelect:    (cameras) => ({ type: 'select', label: 'Select Camera', key: 'cameraId', placeholder: 'Select camera...', options: toOptions.cameras(cameras), hint: 'You can assign a camera after creating the crosswalk' }),
  ledSelect:       (leds)    => ({ type: 'select', label: 'Select LED',    key: 'ledId',    placeholder: 'Select LED...',    options: toOptions.leds(leds),        hint: 'You can assign an LED after creating the crosswalk' }),
  crosswalkSelect: (crosswalks, isEdit) => ({ type: 'select', label: 'Crosswalk', key: 'crosswalkId', placeholder: 'Select a crosswalk', options: toOptions.crosswalks(crosswalks), required: true, disabled: isEdit }),
};

const nullifyFields = (...keys) => (fd) =>
  Object.fromEntries(Object.entries(fd).map(([k, v]) => [k, keys.includes(k) && v === '' ? null : v]));

// deviceTab: factory for camera/LED tabs (structurally identical)
const deviceTab = ({ id, label, icon, deviceKey, getOptions, selectLabel, selectPlaceholder, onLink, onUnlink, onCreate, linkLabel, createLabel }) => {
  const name = label.replace(/\S+\s/, '');
  return {
    id, label, type: 'device', deviceKey,
    sectionTitle: `${icon} ${name} Management`,
    getDeviceCard: device => ({
      header: { icon, title: `${name} ${formatId(device._id)}`, subtitle: 'Linked' },
      fields: [device.status && { label: 'Status', component: <Badge variant={formatStatus(device.status).variant}>{formatStatus(device.status).text}</Badge> }].filter(Boolean),
    }),
    getOptions, selectLabel, selectPlaceholder, onLink, onUnlink, onCreate, linkLabel, createLabel,
  };
};

const dialogConfigs = {
  camera: {
    title:        (isEdit) => isEdit ? 'Edit Camera'   : 'Add New Camera',
    submitText:   (isEdit) => isEdit ? 'Update Camera' : 'Create Camera',
    initialState: (item)   => ({ status: item?.status || 'active' }),
    sections:     ()       => [{ fields: [sharedFields.statusSelect] }],
  },

  led: {
    title:        () => 'Add New LED System',
    submitText:   () => 'Create LED System',
    description:  () => 'A new LED system will be created and ready to be linked to a crosswalk.',
    initialState: () => ({}),
    sections:     () => [],
  },

  alert: {
    title:        (isEdit) => isEdit ? 'Edit Alert'   : 'Add New Alert',
    submitText:   (isEdit) => isEdit ? 'Save Changes' : 'Add Alert',
    initialState: (item)   => ({
      crosswalkId:    item?.crosswalkId?._id      || '',
      dangerLevel:    item?.dangerLevel           || 'LOW',
      detectionPhoto: { url: item?.detectionPhoto?.url || '' },
    }),
    sections: (item, { crosswalks = [] }) => [{
      fields: [ sharedFields.crosswalkSelect(crosswalks, Boolean(item)), sharedFields.dangerLevel, sharedFields.photoUrl ],
    }],
    prepareSubmit: nullifyFields('crosswalkId'),
  },

  crosswalk: {
    title:        (isEdit) => isEdit ? 'Edit Crosswalk' : 'Add New Crosswalk',
    submitText:   (isEdit) => isEdit ? 'Save Changes'   : 'Add Crosswalk',
    maxWidth:     'max-w-2xl',
    initialState: (item)   => ({
      location: { city: item?.location?.city || '', street: item?.location?.street || '', number: item?.location?.number || '' },
      cameraId: item?.cameraId?._id || '',
      ledId:    item?.ledId?._id    || '',
    }),
    sections: (item, { cameras = [], leds = [] }) => [
      { title: '📍 Location Details', fields: [sharedFields.locationCity, sharedFields.locationStreet, sharedFields.locationNumber] },
      { title: '📷 Camera',           fields: [sharedFields.cameraSelect(cameras)] },
      { title: '💡 LED Lighting',     fields: [sharedFields.ledSelect(leds)] },
    ],
    prepareSubmit: nullifyFields('cameraId', 'ledId'),
  },

  'crosswalk-edit': {
    dialogType:  'tabs',
    title:       'Edit Crosswalk',
    getSubtitle: (item) => `${item.location?.city}, ${item.location?.street} ${item.location?.number}`,
    tabs: [
      {
        id: 'location', label: '📍 Location', type: 'form',
        sectionTitle: '📍 Update Location Details',
        formFields:   [{ key: 'city', label: 'City', required: true }, { key: 'street', label: 'Street', required: true }, { key: 'number', label: 'Number', required: true }],
        initState:    (item) => ({ city: item.location?.city || '', street: item.location?.street || '', number: item.location?.number || '' }),
        onSubmit:     (item, formState, ctx) => ctx.onUpdate(item._id, { location: formState }),
        submitLabel:  'Save Changes',
      },
      deviceTab({
        id: 'camera', label: '📷 Camera', icon: '📷', deviceKey: 'cameraId',
        getOptions:        (ctx) => toOptions.cameras(ctx.cameras || []),
        selectLabel:       'Select New Camera', selectPlaceholder: 'Select camera...',
        onLink:    (item, id, ctx) => ctx.onLinkCamera(item._id, id),
        onUnlink:  (item, ctx)     => ctx.onUnlinkCamera(item._id),
        onCreate:  (ctx)           => ctx.onCreateCamera(),
        linkLabel: '🔗 Link Camera', createLabel: '➕ Add New Camera',
      }),
      deviceTab({
        id: 'led', label: '💡 LED', icon: '💡', deviceKey: 'ledId',
        getOptions:        (ctx) => toOptions.leds(ctx.leds || []),
        selectLabel:       'Select New LED', selectPlaceholder: 'Select LED...',
        onLink:    (item, id, ctx) => ctx.onLinkLED(item._id, id),
        onUnlink:  (item, ctx)     => ctx.onUnlinkLED(item._id),
        onCreate:  (ctx)           => ctx.onCreateLED(),
        linkLabel: '🔗 Link LED', createLabel: '➕ Add New LED',
      }),
    ],
  },
};

// ─── ItemDialog ───────────────────────────────────────────────────────────────
// Config-driven dialog — looks up type in dialogConfigs.
// context: extra data needed by sections (e.g. { cameras, leds, crosswalks })

export function ItemDialog({ type, item, open, onClose, onSubmit, loading, context = {} }) {
  const config = dialogConfigs[type];
  if (!config) {
    console.error(`ItemDialog: no config for type="${type}"`);
    return null;
  }

  if (config.dialogType === 'tabs') {
    return <TabDialog tabsConfig={config} item={item} open={open} onClose={onClose} loading={loading} context={context} />;
  }

  const isEdit = Boolean(item);
  const [formData, handleFieldChange] = useFormState(config.initialState, item, open);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={(e) => { e.preventDefault(); onSubmit(config.prepareSubmit ? config.prepareSubmit(formData) : formData); }}
      title={config.title(isEdit)}
      description={config.description?.(isEdit)}
      loading={loading}
      submitText={config.submitText(isEdit)}
      maxWidth={config.maxWidth}
      formData={formData}
      onFieldChange={handleFieldChange}
      sections={config.sections(item, context)}
    />
  );
}
