echo 'convert start'
cd `dirname $0`
cd ../
coffee -c -o output coffee/sasimi.coffee
mv output/sasimi.js output/tmp.js
cat output/tmp.js > output/sasimi.jsx
