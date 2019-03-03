rd dist /s /q

cd CrossFileApi
dotnet clean -c release -r win7-x64
dotnet publish -c release -r win7-x64
cd ..
xcopy CrossFileApi\bin\Release\netcoreapp2.2\win7-x64\publish dist\ /s /e /c /y /h /r

cd CrossFileWap
cmd /C npm run release
cd ..
xcopy CrossFileWap\dist dist\wwwroot\wap /e

cd CrossFileWeb
cmd /C npm run release
cd ..
xcopy CrossFileWeb\dist dist\wwwroot\web /e