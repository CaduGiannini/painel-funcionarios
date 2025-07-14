#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Configurando GitHub Pages automaticamente...\n');

try {
  // Detectar informações do repositório Git
  let repoUrl, username, repoName;
  
  try {
    repoUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    console.log('📍 Repositório detectado:', repoUrl);
    
    // Extrair username e repo name da URL
    if (repoUrl.includes('github.com')) {
      const match = repoUrl.match(/github\.com[\/:]([^\/]+)\/([^\/\.]+)/);
      if (match) {
        username = match[1];
        repoName = match[2];
        console.log('👤 Usuário:', username);
        console.log('📁 Repositório:', repoName);
      }
    }
  } catch (error) {
    console.log('⚠️  Repositório Git não encontrado. Configure manualmente.');
  }

  if (username && repoName) {
    // Atualizar package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const homepageUrl = `https://${username}.github.io/${repoName}`;
    packageJson.homepage = homepageUrl;
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json atualizado!');
    console.log('🌐 Homepage configurada:', homepageUrl);
    
    // Criar arquivo com informações
    const infoContent = `# 🌐 Configuração GitHub Pages

## URLs da Aplicação
- **Desenvolvimento**: http://localhost:3000
- **Produção**: ${homepageUrl}
- **Repository**: https://github.com/${username}/${repoName}
- **Actions**: https://github.com/${username}/${repoName}/actions

## Próximos Passos
1. Configure GitHub Pages: Repository → Settings → Pages → Source: GitHub Actions
2. Faça push das mudanças: git add . && git commit -m "Configure GitHub Pages" && git push
3. Aguarde o deploy automático
4. Acesse: ${homepageUrl}

## Status
- [x] Homepage configurada
- [ ] GitHub Pages ativado
- [ ] Primeiro deploy realizado
`;

    fs.writeFileSync('GITHUB_PAGES_INFO.md', infoContent);
    console.log('📄 Arquivo GITHUB_PAGES_INFO.md criado com detalhes');
    
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('1. Configure GitHub Pages no repositório:');
    console.log(`   https://github.com/${username}/${repoName}/settings/pages`);
    console.log('2. Source: GitHub Actions');
    console.log('3. Faça push das mudanças:');
    console.log('   git add . && git commit -m "Configure GitHub Pages" && git push');
    console.log(`4. Sua aplicação estará em: ${homepageUrl}`);
    
  } else {
    console.log('\n❌ Não foi possível detectar automaticamente o repositório.');
    console.log('📝 Configure manualmente editando package.json:');
    console.log('"homepage": "https://SEU_USUARIO.github.io/SEU_REPOSITORIO"');
  }

} catch (error) {
  console.error('❌ Erro:', error.message);
  console.log('\n📝 Configure manualmente:');
  console.log('1. Edite package.json');
  console.log('2. Adicione: "homepage": "https://SEU_USUARIO.github.io/SEU_REPOSITORIO"');
}

console.log('\n✨ Configuração concluída!');