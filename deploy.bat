
npm run build

cd dist


git init
git checkout -b main
git add -A
git commit -m 'deploy'


git push -f https://github.com/stanl37/stanl37.github.io.git main

cd ..
pause