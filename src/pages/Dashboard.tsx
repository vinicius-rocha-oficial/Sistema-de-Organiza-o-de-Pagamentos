import { useEffect, useState } from 'react';
import { useAuth } from '~/hooks/useAuth';
import { useTheme } from '~/contexts/ThemeContext';
import {
  getOrganizationPaymentsAPI,
  createOrganizationPaymentAPI,
  updateOrganizationPaymentAPI,
  deleteOrganizationPaymentAPI,
  getOrganizationPaymentStatsAPI,
} from '~/services/api/organization-payment';
import { OrganizationPayment, PaymentType, PaymentStats } from '~/types/api';
import { handleApiError } from '~/utils/error-handler';
import { PaymentModal } from '~/components/PaymentModal';
import { QrCode, CreditCard, Wallet, Banknote, Sun, Moon, Plus, LogOut, Edit, Trash2, Calendar, DollarSign, TrendingUp, CheckCircle2, Clock, List, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [payments, setPayments] = useState<OrganizationPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<OrganizationPayment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'despesas' | 'graficos'>('graficos');
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await getOrganizationPaymentsAPI();
      setPayments(response.data.results);
    } catch (err) {
      setError(handleApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await getOrganizationPaymentStatsAPI();
      setStats(response.data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    loadPayments();
    if (activeTab === 'graficos') {
      loadStats();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'graficos') {
      loadStats();
    }
  }, [activeTab]);

  const handleCreate = () => {
    setEditingPayment(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (payment: OrganizationPayment) => {
    setEditingPayment(payment);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<OrganizationPayment>) => {
    try {
      if (isEditing && editingPayment) {
        await updateOrganizationPaymentAPI(editingPayment.id, data);
      } else {
        await createOrganizationPaymentAPI(data);
      }
      await loadPayments();
    } catch (err) {
      throw new Error(handleApiError(err).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este pagamento?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteOrganizationPaymentAPI(id);
      await loadPayments();
    } catch (err) {
      setError(handleApiError(err).message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    if (theme === 'dark') {
      return status === 'paid' ? '#4caf50' : '#ff9800';
    }
    return status === 'paid' ? '#28a745' : '#ffc107';
  };

  const getPaymentIcon = (paymentType: PaymentType) => {
    const iconProps = { size: 24 };
    switch (paymentType) {
      case 'pix':
        return <QrCode {...iconProps} />;
      case 'credit':
        return <CreditCard {...iconProps} />;
      case 'debit':
        return <Wallet {...iconProps} />;
      case 'cash':
        return <Banknote {...iconProps} />;
      default:
        return null;
    }
  };

  const getPaymentIconColor = (paymentType: PaymentType) => {
    switch (paymentType) {
      case 'pix':
        return theme === 'dark' ? '#32CD32' : '#28a745';
      case 'credit':
        return theme === 'dark' ? '#4A90E2' : '#007bff';
      case 'debit':
        return theme === 'dark' ? '#9B59B6' : '#6f42c1';
      case 'cash':
        return theme === 'dark' ? '#F39C12' : '#ffc107';
      default:
        return textSecondary;
    }
  };

  const renderPieLabel = (entry: { name: string; quantidade: number }) => {
    return `${entry.name}: ${entry.quantidade}`;
  };

  const bgColor = theme === 'dark' ? '#121212' : '#f5f5f5';
  const cardBg = theme === 'dark' ? '#1e1e1e' : '#ffffff';
  const textColor = theme === 'dark' ? '#e0e0e0' : '#333';
  const textSecondary = theme === 'dark' ? '#b0b0b0' : '#666';
  const borderColor = theme === 'dark' ? '#333' : '#ddd';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: bgColor,
        color: textColor,
        padding: '2rem',
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
              Organização de Pagamentos
            </h1>
            {user && (
              <p style={{ color: textSecondary, marginTop: '0.5rem', fontSize: '1rem' }}>
                Olá, {user.first_name} {user.last_name}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={toggleTheme}
              style={{
                padding: '0.75rem',
                backgroundColor: 'transparent',
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                cursor: 'pointer',
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === 'dark' ? '#2a2a2a' : '#f5f5f5';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleCreate}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
              }}
            >
              <Plus size={18} />
              Novo Pagamento
            </button>
            <button
              onClick={logout}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)';
              }}
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </header>

        {error && (
          <div
            style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #fcc',
            }}
          >
            {error}
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            borderBottom: `2px solid ${borderColor}`,
          }}
        >
          <button
            onClick={() => setActiveTab('graficos')}
            style={{
              padding: '0.875rem 1.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${activeTab === 'graficos' ? '#007bff' : 'transparent'}`,
              color: activeTab === 'graficos' ? '#007bff' : textSecondary,
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: activeTab === 'graficos' ? '600' : '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              marginBottom: '-2px',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'graficos') {
                e.currentTarget.style.color = textColor;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'graficos') {
                e.currentTarget.style.color = textSecondary;
              }
            }}
          >
            <BarChart3 size={18} />
            Painel/Gráficos
          </button>
          <button
            onClick={() => setActiveTab('despesas')}
            style={{
              padding: '0.875rem 1.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${activeTab === 'despesas' ? '#007bff' : 'transparent'}`,
              color: activeTab === 'despesas' ? '#007bff' : textSecondary,
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: activeTab === 'despesas' ? '600' : '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              marginBottom: '-2px',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'despesas') {
                e.currentTarget.style.color = textColor;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'despesas') {
                e.currentTarget.style.color = textSecondary;
              }
            }}
          >
            <List size={18} />
            Controle de Despesas
          </button>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'graficos' ? (
          <div>
            {isLoadingStats ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem',
                  color: textSecondary,
                  fontSize: '1.2rem',
                }}
              >
                Carregando estatísticas...
              </div>
            ) : stats ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Cards de Resumo */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: `1px solid ${borderColor}`,
                      boxShadow: theme === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          backgroundColor: theme === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckCircle2 size={24} color="#4caf50" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: textSecondary, fontWeight: '500' }}>
                          Total Pago
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: textColor }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.total_pagos)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: textSecondary }}>
                      {stats.quantidade_pagos} pagamento{stats.quantidade_pagos !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: `1px solid ${borderColor}`,
                      boxShadow: theme === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          backgroundColor: theme === 'dark' ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Clock size={24} color="#ff9800" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: textSecondary, fontWeight: '500' }}>
                          Total Pendente
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: textColor }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.total_pendentes)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: textSecondary }}>
                      {stats.quantidade_pendentes} pagamento{stats.quantidade_pendentes !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: `1px solid ${borderColor}`,
                      boxShadow: theme === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          backgroundColor: theme === 'dark' ? 'rgba(74, 144, 226, 0.2)' : 'rgba(74, 144, 226, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CreditCard size={24} color="#4A90E2" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: textSecondary, fontWeight: '500' }}>
                          Total Crédito
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: textColor }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.total_credito)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: textSecondary }}>
                      {stats.quantidade_credito} pagamento{stats.quantidade_credito !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: `1px solid ${borderColor}`,
                      boxShadow: theme === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          backgroundColor: theme === 'dark' ? 'rgba(0, 123, 255, 0.2)' : 'rgba(0, 123, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <DollarSign size={24} color="#007bff" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: textSecondary, fontWeight: '500' }}>
                          Total Geral
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: textColor }}>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.total_geral)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: textSecondary }}>
                      {stats.quantidade_total} pagamento{stats.quantidade_total !== 1 ? 's' : ''} no total
                    </div>
                  </div>
                </div>

                {/* Gráficos */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {/* Gráfico de Pizza - Status */}
                  <div
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: `1px solid ${borderColor}`,
                      boxShadow: theme === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: textColor }}>
                      Status dos Pagamentos
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Pagos', value: stats.total_pagos, quantidade: stats.quantidade_pagos },
                            { name: 'Pendentes', value: stats.total_pendentes, quantidade: stats.quantidade_pendentes },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderPieLabel}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#4caf50" />
                          <Cell fill="#ff9800" />
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: cardBg,
                            border: `1px solid ${borderColor}`,
                            borderRadius: '8px',
                            color: textColor,
                          }}
                          formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gráfico de Barras - Quantidades */}
                  <div
                    style={{
                      backgroundColor: cardBg,
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: `1px solid ${borderColor}`,
                      boxShadow: theme === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: textColor }}>
                      Quantidade de Pagamentos
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          { name: 'Pagos', quantidade: stats.quantidade_pagos },
                          { name: 'Pendentes', quantidade: stats.quantidade_pendentes },
                          { name: 'Crédito', quantidade: stats.quantidade_credito },
                          { name: 'Total', quantidade: stats.quantidade_total },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                        <XAxis dataKey="name" stroke={textSecondary} />
                        <YAxis stroke={textSecondary} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: cardBg,
                            border: `1px solid ${borderColor}`,
                            borderRadius: '8px',
                            color: textColor,
                          }}
                        />
                        <Bar dataKey="quantidade" fill="#007bff" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: cardBg,
                  borderRadius: '16px',
                  padding: '4rem',
                  textAlign: 'center',
                  border: `1px solid ${borderColor}`,
                }}
              >
                <p style={{ color: textSecondary, fontSize: '1rem' }}>
                  Não foi possível carregar as estatísticas.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem',
                  color: textSecondary,
                  fontSize: '1.2rem',
                }}
              >
                Carregando pagamentos...
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>
                    Pagamentos ({payments.length})
                  </h2>
                </div>

                {payments.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '4rem',
                      color: textSecondary,
                      backgroundColor: cardBg,
                      borderRadius: '12px',
                      border: `1px solid ${borderColor}`,
                    }}
                  >
                    <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                      Nenhum pagamento encontrado
                    </p>
                    <button
                      onClick={handleCreate}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                      }}
                    >
                      Criar Primeiro Pagamento
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gap: '1.25rem',
                    }}
                  >
                    {payments.map((payment) => {
                      const iconColor = getPaymentIconColor(payment.payment_type);
                      const statusColor = getStatusColor(payment.status);

                      return (
                        <div
                          key={payment.id}
                          style={{
                            backgroundColor: cardBg,
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow:
                              theme === 'dark'
                                ? '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                                : '0 2px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow =
                              theme === 'dark'
                                ? '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)'
                                : '0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow =
                              theme === 'dark'
                                ? '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                                : '0 2px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)';
                          }}
                        >
                          {/* Barra de status colorida no topo */}
                          <div
                            style={{
                              height: '4px',
                              background: `linear-gradient(90deg, ${statusColor} 0%, ${statusColor}dd 100%)`,
                              width: '100%',
                            }}
                          />

                          <div style={{ padding: '1.5rem' }}>
                            {/* Cabeçalho do card */}
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '1.25rem',
                              }}
                            >
                              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                {/* Ícone do método de pagamento em círculo */}
                                <div
                                  style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '14px',
                                    backgroundColor:
                                      theme === 'dark'
                                        ? `${iconColor}20`
                                        : `${iconColor}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    border: `2px solid ${theme === 'dark' ? `${iconColor}40` : `${iconColor}30`}`,
                                  }}
                                >
                                  <div style={{ color: iconColor }}>
                                    {getPaymentIcon(payment.payment_type)}
                                  </div>
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <h3
                                    style={{
                                      margin: 0,
                                      marginBottom: '0.5rem',
                                      fontSize: '1.25rem',
                                      fontWeight: '700',
                                      color: textColor,
                                      lineHeight: '1.3',
                                    }}
                                  >
                                    {payment.name}
                                  </h3>
                                  <div
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      padding: '0.375rem 0.75rem',
                                      borderRadius: '8px',
                                      backgroundColor:
                                        theme === 'dark'
                                          ? `${iconColor}15`
                                          : `${iconColor}10`,
                                      color: iconColor,
                                      fontSize: '0.875rem',
                                      fontWeight: '600',
                                    }}
                                  >
                                    {getPaymentIcon(payment.payment_type)}
                                    <span>{payment.payment_type_display}</span>
                                  </div>
                                </div>
                              </div>

                              <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
                                <div
                                  style={{
                                    fontSize: '2rem',
                                    fontWeight: '800',
                                    color: statusColor,
                                    marginBottom: '0.5rem',
                                    lineHeight: '1',
                                    letterSpacing: '-0.02em',
                                  }}
                                >
                                  {formatCurrency(payment.amount)}
                                </div>
                                <div
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.375rem 0.875rem',
                                    backgroundColor:
                                      payment.status === 'paid'
                                        ? theme === 'dark'
                                          ? 'rgba(76, 175, 80, 0.25)'
                                          : 'rgba(76, 175, 80, 0.15)'
                                        : theme === 'dark'
                                          ? 'rgba(255, 152, 0, 0.25)'
                                          : 'rgba(255, 152, 0, 0.15)',
                                    color: statusColor,
                                    borderRadius: '8px',
                                    fontSize: '0.8125rem',
                                    fontWeight: '600',
                                    border: `1px solid ${theme === 'dark' ? `${statusColor}40` : `${statusColor}30`}`,
                                  }}
                                >
                                  {payment.status === 'paid' ? (
                                    <CheckCircle2 size={14} />
                                  ) : (
                                    <Clock size={14} />
                                  )}
                                  {payment.status_display}
                                </div>
                              </div>
                            </div>

                            {/* Informações detalhadas */}
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: '12px',
                                backgroundColor:
                                  theme === 'dark'
                                    ? 'rgba(255, 255, 255, 0.03)'
                                    : 'rgba(0, 0, 0, 0.02)',
                                marginBottom: '1.25rem',
                                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar
                                  size={16}
                                  style={{
                                    color: textSecondary,
                                    flexShrink: 0,
                                  }}
                                />
                                <div style={{ fontSize: '0.875rem' }}>
                                  <div
                                    style={{
                                      color: textSecondary,
                                      fontSize: '0.75rem',
                                      marginBottom: '0.125rem',
                                      fontWeight: '500',
                                    }}
                                  >
                                    Vencimento
                                  </div>
                                  <div style={{ color: textColor, fontWeight: '600' }}>
                                    {formatDate(payment.expense_date)}
                                  </div>
                                </div>
                              </div>

                              {payment.installments && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <TrendingUp
                                    size={16}
                                    style={{
                                      color: textSecondary,
                                      flexShrink: 0,
                                    }}
                                  />
                                  <div style={{ fontSize: '0.875rem' }}>
                                    <div
                                      style={{
                                        color: textSecondary,
                                        fontSize: '0.75rem',
                                        marginBottom: '0.125rem',
                                        fontWeight: '500',
                                      }}
                                    >
                                      Parcelas
                                    </div>
                                    <div style={{ color: textColor, fontWeight: '600' }}>
                                      {payment.installments}x de {formatCurrency(payment.installment_amount)}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {payment.expected_end_date && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <Calendar
                                    size={16}
                                    style={{
                                      color: textSecondary,
                                      flexShrink: 0,
                                    }}
                                  />
                                  <div style={{ fontSize: '0.875rem' }}>
                                    <div
                                      style={{
                                        color: textSecondary,
                                        fontSize: '0.75rem',
                                        marginBottom: '0.125rem',
                                        fontWeight: '500',
                                      }}
                                    >
                                      Previsão término
                                    </div>
                                    <div style={{ color: textColor, fontWeight: '600' }}>
                                      {formatDate(payment.expected_end_date)}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {payment.paid_at && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <CheckCircle2
                                    size={16}
                                    style={{
                                      color: '#4caf50',
                                      flexShrink: 0,
                                    }}
                                  />
                                  <div style={{ fontSize: '0.875rem' }}>
                                    <div
                                      style={{
                                        color: textSecondary,
                                        fontSize: '0.75rem',
                                        marginBottom: '0.125rem',
                                        fontWeight: '500',
                                      }}
                                    >
                                      Pago em
                                    </div>
                                    <div style={{ color: '#4caf50', fontWeight: '600' }}>
                                      {formatDate(payment.paid_at)}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {payment.remaining_amount !== '0.00' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <DollarSign
                                    size={16}
                                    style={{
                                      color: textSecondary,
                                      flexShrink: 0,
                                    }}
                                  />
                                  <div style={{ fontSize: '0.875rem' }}>
                                    <div
                                      style={{
                                        color: textSecondary,
                                        fontSize: '0.75rem',
                                        marginBottom: '0.125rem',
                                        fontWeight: '500',
                                      }}
                                    >
                                      Restante
                                    </div>
                                    <div style={{ color: textColor, fontWeight: '600' }}>
                                      {formatCurrency(payment.remaining_amount)}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Botões de ação */}
                            <div
                              style={{
                                display: 'flex',
                                gap: '0.75rem',
                                justifyContent: 'flex-end',
                                paddingTop: '1rem',
                                borderTop: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
                              }}
                            >
                              <button
                                onClick={() => handleEdit(payment)}
                                disabled={deletingId === payment.id}
                                style={{
                                  padding: '0.625rem 1.25rem',
                                  backgroundColor: theme === 'dark' ? '#007bff' : '#007bff',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '10px',
                                  cursor: deletingId === payment.id ? 'not-allowed' : 'pointer',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  opacity: deletingId === payment.id ? 0.6 : 1,
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  boxShadow: '0 2px 8px rgba(0, 123, 255, 0.25)',
                                }}
                                onMouseEnter={(e) => {
                                  if (deletingId !== payment.id) {
                                    e.currentTarget.style.backgroundColor = '#0056b3';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.35)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#007bff';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.25)';
                                }}
                              >
                                <Edit size={16} />
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(payment.id)}
                                disabled={deletingId === payment.id}
                                style={{
                                  padding: '0.625rem 1.25rem',
                                  backgroundColor: theme === 'dark' ? '#dc3545' : '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '10px',
                                  cursor: deletingId === payment.id ? 'not-allowed' : 'pointer',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  opacity: deletingId === payment.id ? 0.6 : 1,
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  boxShadow: '0 2px 8px rgba(220, 53, 69, 0.25)',
                                }}
                                onMouseEnter={(e) => {
                                  if (deletingId !== payment.id) {
                                    e.currentTarget.style.backgroundColor = '#c82333';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.35)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#dc3545';
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.25)';
                                }}
                              >
                                <Trash2 size={16} />
                                {deletingId === payment.id ? 'Excluindo...' : 'Excluir'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPayment(null);
        }}
        onSave={handleSave}
        payment={editingPayment}
        isEditing={isEditing}
      />
    </div>
  );
};
