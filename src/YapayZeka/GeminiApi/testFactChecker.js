import GeminiFactChecker from './factChecker.js';

/**
 * Gemini Fact-Checker Test Dosyası
 */

async function runTests() {
  console.log('🚀 Gemini Fact-Checker Test Başlatılıyor...\n');

  const checker = new GeminiFactChecker();

  // Test 1: Doğru bir bilgi
  console.log('📝 Test 1: Doğru Bilgi');
  console.log('─'.repeat(50));
  const test1 = 'İstanbul, Türkiye\'nin en kalabalık şehridir.';
  console.log(`Metin: "${test1}"\n`);
  const result1 = await checker.checkFact(test1);
  console.log('Sonuç:', JSON.stringify(result1.data, null, 2));
  console.log('\n');

  // 1 saniye bekle (rate limit için)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Yanlış bir bilgi
  console.log('📝 Test 2: Yanlış Bilgi');
  console.log('─'.repeat(50));
  const test2 = 'Ay, güneşten daha büyüktür.';
  console.log(`Metin: "${test2}"\n`);
  const result2 = await checker.checkFact(test2);
  console.log('Sonuç:', JSON.stringify(result2.data, null, 2));
  console.log('\n');

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Belirsiz bir bilgi
  console.log('📝 Test 3: Belirsiz/Doğrulanamaz Bilgi');
  console.log('─'.repeat(50));
  const test3 = 'Yarın hava çok güzel olacak.';
  console.log(`Metin: "${test3}"\n`);
  const result3 = await checker.checkFact(test3);
  console.log('Sonuç:', JSON.stringify(result3.data, null, 2));
  console.log('\n');

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 4: Sosyal medya postu
  console.log('📝 Test 4: Sosyal Medya Postu');
  console.log('─'.repeat(50));
  const post = {
    content_text: 'Bilim insanları Mars\'ta su buldu! #bilim #mars',
    media_type: 'image'
  };
  console.log(`Post: "${post.content_text}"`);
  console.log(`Media Type: ${post.media_type}\n`);
  const result4 = await checker.checkSocialPost(post);
  console.log('Sonuç:', JSON.stringify(result4.data, null, 2));
  console.log('\n');

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 5: Toplu kontrol
  console.log('📝 Test 5: Toplu Fact-Check');
  console.log('─'.repeat(50));
  const texts = [
    'Dünya yuvarlaktır.',
    'Güneş batıdan doğar.',
    'İnsanlar Ay\'a gitti.'
  ];
  console.log('Metinler:');
  texts.forEach((text, index) => {
    console.log(`${index + 1}. "${text}"`);
  });
  console.log('\nAnaliz ediliyor...\n');
  
  const batchResults = await checker.checkFactBatch(texts);
  batchResults.forEach((result, index) => {
    console.log(`\n${index + 1}. Metin Sonucu:`);
    console.log(JSON.stringify(result.data, null, 2));
  });

  console.log('\n✅ Tüm testler tamamlandı!');
}

// Testleri çalıştır
runTests().catch(error => {
  console.error('❌ Test hatası:', error);
  process.exit(1);
});
