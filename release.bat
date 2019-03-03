rd dist /s /q

cd CrossFileApi
dotnet publish -c release -r win7-x64
cd ..
xcopy CrossFileApi\bin\Release\netcoreapp2.2\win7-x64 dist\ /s /e /c /y /h /r

cd CrossFileWap
npm run release
cd ..
xcopy CrossFileWap\dist dist\publish\wwwroot\wap /e

cd CrossFileWeb
npm run release
cd ..
xcopy CrossFileWeb\dist dist\publish\wwwroot\web /e