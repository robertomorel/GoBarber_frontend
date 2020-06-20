import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FiPower, FiClock } from 'react-icons/fi';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Schedule,
  Content,
  NextAppointment,
  Calendar,
  Section,
  Appointment,
} from './styles';
import logoImg from '../../assets/logo.svg';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appointment[]>('appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const appoitmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          };
        });

        setAppointments(appoitmentsFormatted);
      });
  }, [selectedDate]);

  /**
   * useMemo é utilizado de forma semelhante ao useCallBack e useEffect.
   *   Apenas é chamado uma única vez, ou atualizado sempre que alguma variável modificar.
   *   Serve no auxílio de manipulação de variáveis que serão exibidas em tela.
   *   Nunca podemos executar uma função ou formatação em tela, pq com qlqr mudança,
   *   a tela é renderizada, e essas funções vão ser constantemente chamadas.
   */
  const disabledDays = useMemo(() => {
    // -- Pega a disponibilidade de todos os dias de um mês específico...
    const dates = monthAvailability
      // -- Filtra os registros que não possuem disponibilidade
      .filter(monthDay => monthDay.available === false)
      // -- Roda um map nos registros não disponíveis para criar uma data completa de dias indisponíveis
      /**
       * A rota "month-availability" não retorna uma data completa, mas um dia e a disponibilidade
       */
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: ptBR,
    });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // -- Antes de 12 horas
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // -- Antes de 12 horas
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]) as Appointment;

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            {/* <img src={user.avatar_url} alt={user.name} /> */}
            <img
              src="https://avatars0.githubusercontent.com/u/49918342?s=400&u=8d5765a21f6b67e45735501315b98f5da3fff7d2&v=4"
              alt={user.name}
            />

            <div>
              <span>Bem-vindo,</span>
              <Link to="/profile">
                <strong>Roberto Morel</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários Agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                {/* <img src={user.avatar_url} alt={user.name} /> */}
                <img
                  src="https://avatars0.githubusercontent.com/u/49918342?s=400&u=8d5765a21f6b67e45735501315b98f5da3fff7d2&v=4"
                  alt={nextAppointment.user.name}
                />

                <strong>Roberto Morel</strong>

                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>

            {morningAppointments.length === 0 && (
              <p>Nenhum agendamento neste período.</p>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  {/* <img src={user.avatar_url} alt={user.name} /> */}
                  <img
                    src="https://avatars0.githubusercontent.com/u/49918342?s=400&u=8d5765a21f6b67e45735501315b98f5da3fff7d2&v=4"
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>Tarde</strong>

            {afternoonAppointments.length === 0 && (
              <p>Nenhum agendamento neste período.</p>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>

                <div>
                  {/* <img src={user.avatar_url} alt={user.name} /> */}
                  <img
                    src="https://avatars0.githubusercontent.com/u/49918342?s=400&u=8d5765a21f6b67e45735501315b98f5da3fff7d2&v=4"
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            // -- Para settar os dias da semana
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            // -- Não vai permitir selecionar dias anteriores ao atual
            fromMonth={new Date()}
            // -- Disabilitar alguns dias da semana (no caso, domingo e sábado)
            disabledDays={[...disabledDays, { daysOfWeek: [0, 6] }]}
            // -- Joga um estilo em alguns dias da semana
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            selectedDays={selectedDate}
            onMonthChange={handleMonthChange}
            onDayClick={handleDateChange}
            // -- Para settar os dias da semana
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
