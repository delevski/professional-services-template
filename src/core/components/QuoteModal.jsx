import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { submitLead } from '../services/leads';
import { buildWhatsAppUrl } from '../utils/whatsapp';

function composeMessage(lead, copy) {
  const labels = copy.labels;
  return [copy.intro, `${labels.name}: ${lead.name}`, `${labels.phone}: ${lead.phone}`, `${labels.workType}: ${lead.workType}`, `${labels.city}: ${lead.city}`, `${labels.urgency}: ${lead.urgency}`, lead.description ? `${labels.description}: ${lead.description}` : ''];
}

export default function QuoteModal({ open, onClose, profile, submitLeadFn = submitLead }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [manualUrl, setManualUrl] = useState('');
  const labels = profile.ui.modal;
  const form = profile.leadForm;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open) {
      openerRef.current = document.activeElement;
      if (!dialog.open) dialog.showModal();
      closeRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  const requestClose = () => {
    onClose();
    queueMicrotask(() => openerRef.current?.focus());
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const fieldErrors = Object.fromEntries(Object.entries(form.fields).filter(([, field]) => field.required).filter(([key]) => !String(values[key] ?? '').trim()).map(([key]) => [key, labels.requiredError]));
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    const lead = { name: values.fullName, phone: values.phone, workType: values.workType, city: values.area, urgency: values.urgency, description: values.description, storageKey: form.demoStorageKey };
    setStatus('submitting');
    try {
      await submitLeadFn(lead);
      const url = buildWhatsAppUrl({ messageParts: composeMessage(lead, form.whatsappMessage) }, profile.contact.whatsapp);
      setManualUrl(url);
      setStatus('success');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      setStatus('failure');
    }
  };

  return <dialog ref={dialogRef} className="modal-backdrop" aria-labelledby="quote-title" onCancel={event => { event.preventDefault(); requestClose(); }}>
    <div className="modal">
      <button ref={closeRef} type="button" className="modal__close" onClick={requestClose} aria-label={labels.closeLabel}><X /></button>
      <p className="eyebrow">{labels.eyebrow}</p><h2 id="quote-title">{form.heading}</h2><p>{labels.description}</p>
      <form noValidate onSubmit={handleSubmit}>
        {Object.entries(form.fields).map(([key, field]) => {
          const inputId = `quote-${key}`;
          const errorId = `${inputId}-error`;
          const accessibility = { id: inputId, name: key, 'aria-invalid': errors[key] ? 'true' : undefined, 'aria-describedby': errors[key] ? errorId : undefined };
          return <div className="form-field" key={key}><label htmlFor={inputId}>{field.label}</label>
            {key === 'description' ? <textarea {...accessibility} /> : key === 'workType' ? <select {...accessibility} defaultValue=""><option value="" />{form.workTypes.map(option => <option key={option}>{option}</option>)}</select> : key === 'urgency' ? <select {...accessibility} defaultValue=""><option value="" />{form.urgencyOptions.map(option => <option key={option}>{option}</option>)}</select> : <input {...accessibility} />}
            {errors[key] ? <span id={errorId} className="field-error" role="alert">{errors[key]}</span> : null}
          </div>;
        })}
        <Button type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? form.submittingLabel : form.submitLabel}</Button>
      </form>
      {status === 'failure' ? <p role="alert">{labels.failureMessage}</p> : null}
      {status === 'success' ? <div role="status"><p>{labels.successMessage}</p><a href={manualUrl} target="_blank" rel="noreferrer">{labels.manualWhatsappLabel}</a></div> : null}
    </div>
  </dialog>;
}
