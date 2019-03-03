﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CrossFile.Data;
using CrossFile.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using AutoMapper;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace CrossFile
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();

            services.Configure<FormOptions>(o => { o.MultipartBodyLengthLimit = long.MaxValue; });

            services.AddDbContextPool<CrossFileDbContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("sqlite")));

            services.AddAutoMapper(config =>
            {
                config.AllowNullCollections = true;
                config.AllowNullDestinationValues = true;
                config.CreateMissingTypeMaps = true;
                config.ValidateInlineMaps = false;
            });

            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<IFileService, FileService>();

            return services.BuildServiceProvider();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider)
        {
            InitApplication(serviceProvider, env);

            // app.UseHttpsRedirection();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCrossFileRewrite();

            app.UseStaticFiles();

            app.UseMvc();
        }

        public void InitApplication(IServiceProvider serviceProvider, IHostingEnvironment env)
        {
            // create db file if not exist
            var connectionString = Configuration.GetConnectionString("sqlite");
            var connectionDict = connectionString.Split(";")
                .Where(i => !string.IsNullOrEmpty(i))
                .ToDictionary(i => i.Split("=")[0], i => i.Split("=")[1]);
            
            var sqliteDbFile = Path.Combine(env.ContentRootPath, connectionDict["Data Source"]);

            if (!File.Exists(sqliteDbFile))
            {
                var fs = File.Create(sqliteDbFile);
                fs.Close();
            }

            // init database
            var context = serviceProvider.GetService<CrossFileDbContext>();

            context.Database.Migrate();
        }
    }
}