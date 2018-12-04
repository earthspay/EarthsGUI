#!/usr/bin/env bash
./node_modules/.bin/tsc -p ./data-service  || exit 1
echo "compile data services >> DONE"
./node_modules/.bin/browserify data-service/index.js --node -s ds -u @earths/assets-pairs-order -u ts-utils -u @earths/data-entities -u @earths/signature-generator -u @earths/signature-adapter -u ramda --no-bf -o ./data-service-dist/data-service.js
echo "Build data services >> DONE"
exit 0
