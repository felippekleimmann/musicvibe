#!/usr/bin/env node

/**
 * Script para facilitar gravação do vídeo
 * Executa os testes em sequência com delays para facilitar edição
 */

import { spawn } from 'child_process';

console.log('🎬 PREPARANDO PARA GRAVAÇÃO DO VÍDEO - NOTA 8\n');
console.log('='.repeat(60));

const steps = [
  {
    name: '📊 Executar todos os testes',
    cmd: 'npm',
    args: ['test', '--', '--run'],
    delay: 2000
  },
  {
    name: '🧪 Executar apenas testes do User Service',
    cmd: 'npm',
    args: ['test', '--', 'user.service', '--run'],
    delay: 1000
  },
  {
    name: '🔗 Executar apenas testes de Integração do User',
    cmd: 'npm',
    args: ['test', '--', 'user.controller', '--run'],
    delay: 1000
  },
  {
    name: '📈 Gerar relatório de cobertura',
    cmd: 'npm',
    args: ['test', '--', '--coverage', '--run'],
    delay: 1000
  }
];

let currentStep = 0;

function runStep() {
  if (currentStep >= steps.length) {
    console.log('\n' + '='.repeat(60));
    console.log('✅ PRONTO PARA GRAVAR!\n');
    console.log('Próximas etapas:');
    console.log('1. Abra o VS Code com este projeto');
    console.log('2. Abra um terminal (Ctrl + `)');
    console.log('3. Execute os comandos que você viu acima');
    console.log('4. Navegue no código enquanto grava');
    console.log('5. Publique o vídeo no YouTube ou OneDrive\n');
    process.exit(0);
  }

  const step = steps[currentStep];
  console.log(`\n📍 Passo ${currentStep + 1}/${steps.length}: ${step.name}`);
  console.log('-'.repeat(60));
  console.log(`Executando: ${step.cmd} ${step.args.join(' ')}\n`);

  const proc = spawn(step.cmd, step.args, {
    stdio: 'inherit',
    shell: true
  });

  proc.on('close', (code) => {
    if (code !== 0) {
      console.error(`\n❌ Erro ao executar passo ${currentStep + 1}`);
      process.exit(1);
    }

    currentStep++;
    console.log(`\n⏳ Aguardando ${step.delay / 1000}s para próximo passo...`);
    setTimeout(runStep, step.delay);
  });
}

runStep();
