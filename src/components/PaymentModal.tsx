import { useState, useEffect } from 'react';
import { OrganizationPayment, PaymentType, PaymentStatus } from '~/types/api';
import { useTheme } from '~/contexts/ThemeContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<OrganizationPayment>) => Promise<void>;
  payment?: OrganizationPayment | null;
  isEditing: boolean;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  onSave,
  payment,
  isEditing,
}: PaymentModalProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    payment_type: 'pix' as PaymentType,
    status: 'pending' as PaymentStatus,
    expense_date: '',
    installments: '',
    expected_end_date: '',
    external_reference: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (payment && isEditing) {
      setFormData({
        name: payment.name || '',
        amount: payment.amount || '',
        payment_type: payment.payment_type || 'pix',
        status: payment.status || 'pending',
        expense_date: payment.expense_date ? payment.expense_date.split('T')[0] : '',
        installments: payment.installments?.toString() || '',
        expected_end_date: payment.expected_end_date
          ? payment.expected_end_date.split('T')[0]
          : '',
        external_reference: payment.external_reference || '',
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        payment_type: 'pix',
        status: 'pending',
        expense_date: '',
        installments: '',
        expected_end_date: '',
        external_reference: '',
      });
    }
    setError('');
  }, [payment, isEditing, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const dataToSave: Partial<OrganizationPayment> = {
        name: formData.name,
        amount: formData.amount,
        payment_type: formData.payment_type,
        status: formData.status,
        expense_date: formData.expense_date,
        installments: formData.installments ? parseInt(formData.installments) : null,
        expected_end_date: formData.expected_end_date || null,
        external_reference: formData.external_reference || null,
      };

      await onSave(dataToSave);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar pagamento');
    } finally {
      setIsSaving(false);
    }
  };

  const modalStyles = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const contentStyles = {
    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    boxShadow: theme === 'dark'
      ? '0 10px 40px rgba(0, 0, 0, 0.5)'
      : '0 10px 40px rgba(0, 0, 0, 0.2)',
  };

  const inputStyles = {
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: theme === 'dark' ? '#e0e0e0' : '#333',
  };

  return (
    <div style={modalStyles} onClick={onClose}>
      <div style={contentStyles} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: theme === 'dark' ? '#ffffff' : '#000000' }}>
          {isEditing ? 'Editar Pagamento' : 'Novo Pagamento'}
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '0.75rem',
              borderRadius: '6px',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyles}>Nome *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={inputStyles}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyles}>Valor *</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              style={inputStyles}
              placeholder="0.00"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyles}>Tipo de Pagamento *</label>
            <select
              value={formData.payment_type}
              onChange={(e) =>
                setFormData({ ...formData, payment_type: e.target.value as PaymentType })
              }
              required
              style={inputStyles}
            >
              <option value="pix">PIX</option>
              <option value="credit">Cartão de Crédito</option>
              <option value="debit">Cartão de Débito</option>
              <option value="cash">Dinheiro</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyles}>Status *</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as PaymentStatus })
              }
              required
              style={inputStyles}
            >
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyles}>Data de Vencimento *</label>
            <input
              type="date"
              value={formData.expense_date}
              onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
              required
              style={inputStyles}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyles}>Parcelas</label>
            <input
              type="number"
              value={formData.installments}
              onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
              style={inputStyles}
              placeholder="Deixe vazio se não houver parcelas"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyles}>Previsão de Término</label>
            <input
              type="date"
              value={formData.expected_end_date}
              onChange={(e) =>
                setFormData({ ...formData, expected_end_date: e.target.value })
              }
              style={inputStyles}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyles}>Referência Externa</label>
            <input
              type="text"
              value={formData.external_reference}
              onChange={(e) =>
                setFormData({ ...formData, external_reference: e.target.value })
              }
              style={inputStyles}
              placeholder="Opcional"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: theme === 'dark' ? '#ffffff' : '#333',
                border: `1px solid ${theme === 'dark' ? '#444' : '#ddd'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
