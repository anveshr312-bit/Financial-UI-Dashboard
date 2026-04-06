import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { TransactionsSection } from './TransactionsSection';
import { TransactionModal } from './TransactionModal';
import { Transaction } from '../types';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { OverviewView } from './OverviewView';
import { AnalyticsView } from './AnalyticsView';
import { ReportsView } from './ReportsView';
import { AdminView } from './AdminView';

export const Dashboard = () => {
  const { transactions, addTransaction, updateTransaction, activeView, setActiveView } = useDashboard();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTx, setEditingTx] = React.useState<Transaction | undefined>(undefined);

  const handleOpenAdd = () => {
    setEditingTx(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    const tx = transactions.find((transaction) => transaction.id === id);
    if (tx) {
      setEditingTx(tx);
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = (tx: Omit<Transaction, 'id'> | Transaction) => {
    if ('id' in tx) {
      updateTransaction(tx.id, tx);
    } else {
      addTransaction(tx);
    }
  };

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  return (
    <>
      <Sidebar />
      <main className="lg:ml-[240px] min-h-screen transition-all duration-300">
        <Navbar />
        <div className="pt-24 px-4 sm:px-8 pb-12 overflow-x-hidden">
          {activeView === 'overview' && <OverviewView onViewAll={() => setActiveView('transactions')} />}
          {activeView === 'transactions' && (
            <TransactionsSection onAdd={handleOpenAdd} onEdit={handleOpenEdit} />
          )}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'reports' && <ReportsView />}
          {activeView === 'admin' && <AdminView />}
        </div>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTx}
      />
    </>
  );
};
