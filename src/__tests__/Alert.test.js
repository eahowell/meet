import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeContext } from '../contexts/ThemeContext'
import { InfoAlert, ErrorAlert } from '../components/Alert'

describe('Alert Component', () => {
  const renderWithTheme = (component, { isDarkMode = false } = {}) => {
    render(
      <ThemeContext.Provider value={{ isDarkMode }}>
        {component}
      </ThemeContext.Provider>
    )
  }

  test('InfoAlert applies correct style in light mode', () => {
    renderWithTheme(<InfoAlert text="Test info" />)
    const alertElement = screen.getByText('Test info')
    expect(alertElement).toHaveStyle({
      color: 'rgb(0, 0, 255)',
      backgroundColor: 'rgb(220, 220, 255)',
      borderColor: 'rgb(0, 0, 255)',
    })
  })

  test('InfoAlert applies correct style in dark mode', () => {
    renderWithTheme(<InfoAlert text="Test info" />, { isDarkMode: true })
    const alertElement = screen.getByText('Test info')
    expect(alertElement).toHaveStyle({
      color: 'white',
      backgroundColor: 'rgb(0, 77, 150)',
      borderColor: 'white',
    })
  })

  test('ErrorAlert applies correct style in light mode', () => {
    renderWithTheme(<ErrorAlert text="Test error" />)
    const alertElement = screen.getByText('Test error')
    expect(alertElement).toHaveStyle({
      color: 'rgb(255, 0, 0)',
      backgroundColor: 'rgb(255, 200, 200)',
      borderColor: 'rgb(255, 0, 0)',
    })
  })

  test('ErrorAlert applies correct style in dark mode', () => {
    renderWithTheme(<ErrorAlert text="Test error" />, { isDarkMode: true })
    const alertElement = screen.getByText('Test error')
    expect(alertElement).toHaveStyle({
      color: 'white',
      backgroundColor: 'rgb(191, 0, 0)',
      borderColor: 'white',
    })
  })
})