import { useEffect, useReducer, useRef, useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { submitLead } from '../services/leads';
import { buildWhatsAppUrl } from '../utils/whatsapp';

function composeMessage(lead, copy) {
  const labels = copy.labels;
  return [copy.intro, `${labels.name}: ${lead.name}`, `${labels.phone}: ${lead.phone}`, `${labels.workType}: ${lead.workType}`, `${labels.city}: ${lead.city}`, `${labels.urgency}: ${lead.urgency}`, lead.description ? `${labels.description}: ${lead.description}` : ''];
}

const initialSession = { errors: {}, status: 'idle', manualUrl: '', formSession: 0 };

function sessionReducer(state, action) {
  switch (action.type) {
    case 'validation': return { ...state, errors: action.errors };
    case 'submitting': return { ...state, status: 'submitting' };
    case 'success': return { ...state, status: 'success', manualUrl: action.url };
    case 'failure': return { ...state, status: 'failure' };
    case 'closed':
      if (state.status === 'success') return { ...initialSession, formSession: state.formSession + 1 };
      if (state.status === 'submitting') return { ...state, status: 'idle' };
      return state;
    default: return state;
  }
}

export default function QuoteModal({ open, onClose, profile, submitLeadFn = submitLead }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const generationRef = useRef(0);
  const openRef = useRef(open);
  const [previousOpen, setPreviousOpen] = useState(open);
  const [session, dispatch] = useReducer(sessionReducer, initialSession);
  const labels = profile.ui.modal;
  const form = profile.leadForm;
  openRef.current = open;
  if (open !== previousOpen) {
    setPreviousOpen(open);
    if (!open) {
      generationRef.current += 1;
      dispatch({ type: 'closed' });
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open) {
      openerRef.current = document.activeElement;
      if (!dialog.open) dialog.showModal();
      dialog.addEventListener('keydown', trapFocus);
      closeRef.current?.focus();
    } else {
      if (dialog.open) dialog.close();
      queueMicrotask(() => openerRef.current?.focus());
    }
    return () => dialog.removeEventListener('keydown', trapFocus);
  }, [open]);

  const requestClose = () => onClose();

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  const handleSubmit = async event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const fieldErrors = {};
    for (const [key, field] of Object.entries(form.fields)) {
      if (field.required && !String(values[key] ?? '').trim()) fieldErrors[key] = labels.requiredError;
    }
    dispatch({ type: 'validation', errors: fieldErrors });
    if (Object.keys(fieldErrors).length) return;

    const lead = { name: values.fullName, phone: values.phone, workType: values.workType, city: values.area, urgency: values.urgency, description: values.description, storageKey: form.demoStorageKey };
    const generation = ++generationRef.current;
    dispatch({ type: 'submitting' });
    try {
      await submitLeadFn(lead);
      if (!openRef.current || generation !== generationRef.current) return;
      const url = buildWhatsAppUrl({ messageParts: composeMessage(lead, form.whatsappMessage) }, profile.contact.whatsapp);
      dispatch({ type: 'success', url });
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      if (!openRef.current || generation !== generationRef.current) return;
      dispatch({ type: 'failure' });
    }
  };

  return <dialog ref={dialogRef} className="modal-backdrop" aria-labelledby="quote-title" onCancel={event => { event.preventDefault(); requestClose(); }}>
    <div className="modal">
      <button ref={closeRef} type="button" className="modal__close" onClick={requestClose} aria-label={labels.closeLabel}><X /></button>
      <p className="eyebrow">{labels.eyebrow}</p><h2 id="quote-title">{form.heading}</h2><p>{labels.description}</p>
      <form key={session.formSession} noValidate onSubmit={handleSubmit}>
        {Object.entries(form.fields).map(([key, field]) => {
          const inputId = `quote-${key}`;
          const errorId = `${inputId}-error`;
          const accessibility = { id: inputId, name: key, 'aria-invalid': session.errors[key] ? 'true' : undefined, 'aria-describedby': session.errors[key] ? errorId : undefined };
          return <div className="form-field" key={key}><label htmlFor={inputId}>{field.label}</label>
            {key === 'description' ? <textarea {...accessibility} /> : key === 'workType' ? <select {...accessibility} defaultValue=""><option value="">{field.placeholder}</option>{form.workTypes.map(option => <option key={option}>{option}</option>)}</select> : key === 'urgency' ? <select {...accessibility} defaultValue=""><option value="">{field.placeholder}</option>{form.urgencyOptions.map(option => <option key={option}>{option}</option>)}</select> : <input {...accessibility} />}
            {session.errors[key] ? <span id={errorId} className="field-error" role="alert">{session.errors[key]}</span> : null}
          </div>;
        })}
        <Button type="submit" disabled={session.status === 'submitting'}>{session.status === 'submitting' ? form.submittingLabel : form.submitLabel}</Button>
      </form>
      {session.status === 'failure' ? <p role="alert">{labels.failureMessage}</p> : null}
      {session.status === 'success' ? <div role="status"><p>{labels.successMessage}</p><a href={session.manualUrl} target="_blank" rel="noreferrer">{labels.manualWhatsappLabel}</a></div> : null}
    </div>
  </dialog>;
}
