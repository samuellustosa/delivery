"use client"
import { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale/pt-BR'

import "react-datepicker/dist/react-datepicker.css"

registerLocale("pt-BR", ptBR)

interface CustomDatePickerProps {
  minDate?: Date;
  className?: string;
  initialDate?: Date;
  onChange: (date: Date) => void;
  label?: string; // Adicionado para melhor contexto na UI
}

/**
 * Componente de seleção de data adaptado para Delivery.
 * Pode ser usado em filtros de relatórios ou agendamento de entregas futuras.
 */
export function CustomDatePicker({ initialDate, className, minDate, onChange, label }: CustomDatePickerProps) {
  const [startDate, setStartDate] = useState(initialDate || new Date())

  function handleChange(date: Date | null) {
    if (date) {
      setStartDate(date);
      onChange(date);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <DatePicker
        className={className || "border rounded-md px-3 py-2 text-sm w-full"}
        selected={startDate}
        locale="pt-BR"
        minDate={minDate} // Removido o 'new Date()' fixo para permitir consultas retroativas no admin
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="Selecione uma data"
      />
    </div>
  )
}