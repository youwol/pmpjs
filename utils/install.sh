if [ ! -d "build" ]
then
    mkdir build
fi

cd build && emcmake cmake .. && make -j12 && cd .. && npm run compile-prod && npm run doc && cd ..