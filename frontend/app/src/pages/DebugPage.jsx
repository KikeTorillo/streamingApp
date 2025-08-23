// DebugPage.jsx - Página de prueba para verificar componentes
import React from 'react';
import { ButtonDebug } from '../components/atoms/Button/ButtonDebug';
import { IconDebug } from '../components/atoms/Icon/IconDebug';
import { Button } from '../components/atoms/Button/Button';
import { IconProvider } from '../providers/IconProvider';

export function DebugPage() {
  return (
    <IconProvider>
      <div style={{ padding: '2rem', fontFamily: 'var(--font-family-base)' }}>
        <h1>Debug Page - Componentes</h1>
        
        <section style={{ marginBottom: '3rem' }}>
          <h2>Button Component Debug</h2>
          <ButtonDebug />
        </section>
        
        <section style={{ marginBottom: '3rem' }}>
          <h2>Icon Component Debug</h2>
          <IconDebug />
        </section>
        
        <section style={{ marginBottom: '3rem' }}>
          <h2>Button Component Real</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="neutral">Neutral</Button>
          </div>
        </section>
        
        <section style={{ marginBottom: '3rem' }}>
          <h2>Button with Icons</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button leftIcon="home" variant="primary">Home</Button>
            <Button rightIcon="arrow-right" variant="secondary">Next</Button>
            <Button leftIcon="save" rightIcon="check" variant="success">Save</Button>
            <Button iconOnly leftIcon="heart" aria-label="Like" variant="danger" />
          </div>
        </section>
        
        <section style={{ marginBottom: '3rem' }}>
          <h2>Button Sizes</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button size="xs" variant="primary">XS Button</Button>
            <Button size="sm" variant="primary">SM Button</Button>
            <Button size="md" variant="primary">MD Button</Button>
            <Button size="lg" variant="primary">LG Button</Button>
            <Button size="xl" variant="primary">XL Button</Button>
          </div>
        </section>
      </div>
    </IconProvider>
  );
}