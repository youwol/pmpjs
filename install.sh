if [ ! -d "pmp-library" ]
then
    git clone --recursive https://github.com/pmp-library/pmp-library.git
fi

cp utils/CMakeLists.txt pmp-library
cp utils/rename.py pmp-library
cp utils/package.json pmp-library
cp utils/install.sh pmp-library
cp utils/API.d.ts pmp-library
cp utils/src/CMakeLists.txt pmp-library/src/pmp
cp utils/src/bindings.cxx pmp-library/src/pmp
cp -fr utils/documentation pmp-library/
cp utils/pagesconfig.json pmp-library/
cp utils/tsconfig.json pmp-library/

yes | cp -rf README.md pmp-library/

cd pmp-library && source install.sh

#rm -fr pmp-library
