import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      const responseBalance = response.data.balance;

      const responseTransactions = response.data.transactions;

      responseTransactions.forEach((item: any, index: any) => {
        responseTransactions[index].formattedValue = formatValue(item.value);

        const date = new Date(item.created_at);

        responseTransactions[index].created_at = date; //eslint-disable-line

        const day =
          date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;

        const month =
          date.getMonth() < 10 ? `0${date.getMonth()}` : `${date.getMonth()}`;

        const year = date.getFullYear();

        responseTransactions[index].formattedDate = `${day}/${month}/${year}`;
      });

      setTransactions(responseTransactions);
      setBalance(responseBalance);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header page="dashboard" />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {formatValue(parseInt(balance.income, 10))}
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(parseInt(balance.outcome, 10))}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {formatValue(parseInt(balance.total, 10))}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => {
                if (transaction.type === 'income') {
                  return (
                    <tr key={transaction.id}>
                      <td className="title">{transaction.title}</td>
                      <td className="income">{transaction.formattedValue}</td>
                      <td>{transaction.category.title}</td>
                      <td>{transaction.formattedDate}</td>
                    </tr>
                  );
                }
                return (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className="outcome">- {transaction.formattedValue}</td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
