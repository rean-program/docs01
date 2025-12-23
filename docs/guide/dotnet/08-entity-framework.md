# Entity Framework Core

Learn how to use Entity Framework Core for database access in .NET applications.

::: info What You'll Learn
- Setting up EF Core
- Creating models and DbContext
- Migrations
- Querying data with LINQ
- Relationships and navigation properties
:::

## What is Entity Framework Core?

EF Core is an Object-Relational Mapper (ORM) that lets you work with databases using C# objects.

```
C# Objects          Entity Framework Core          Database
───────────         ─────────────────────          ────────

class User    →     Translates to SQL      →      Users Table
{                                                  ┌────────────┐
  int Id;                                         │ Id (PK)    │
  string Name;                                    │ Name       │
}                                                 │ Email      │
                                                  └────────────┘
```

## Setting Up EF Core

### Install Packages

```bash
# SQL Server
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

# PostgreSQL
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

# SQLite
dotnet add package Microsoft.EntityFrameworkCore.Sqlite

# Design tools (for migrations)
dotnet add package Microsoft.EntityFrameworkCore.Design

# CLI tools (global)
dotnet tool install --global dotnet-ef
```

## Creating Models

### Basic Entity

```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}
```

### Entity with Relationships

```csharp
public class Blog
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Url { get; set; } = "";

    // Navigation property - one blog has many posts
    public List<Post> Posts { get; set; } = new();
}

public class Post
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Content { get; set; } = "";
    public DateTime PublishedAt { get; set; }

    // Foreign key
    public int BlogId { get; set; }

    // Navigation property
    public Blog Blog { get; set; } = null!;

    // Many-to-many (EF Core 5+)
    public List<Tag> Tags { get; set; } = new();
}

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; } = "";

    public List<Post> Posts { get; set; } = new();
}
```

## Creating DbContext

```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Blog> Blogs => Set<Blog>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Tag> Tags => Set<Tag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Fluent API configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasOne(p => p.Blog)
                  .WithMany(b => b.Posts)
                  .HasForeignKey(p => p.BlogId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
```

## Registering DbContext

```csharp
var builder = WebApplication.CreateBuilder(args);

// SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=app.db"));
```

## Migrations

### Create Migration

```bash
# Create initial migration
dotnet ef migrations add InitialCreate

# Create migration with specific name
dotnet ef migrations add AddUserEmail
```

### Apply Migrations

```bash
# Update database
dotnet ef database update

# Update to specific migration
dotnet ef database update InitialCreate

# Generate SQL script
dotnet ef migrations script
```

### Remove/Revert Migrations

```bash
# Remove last migration (if not applied)
dotnet ef migrations remove

# Revert database to specific migration
dotnet ef database update PreviousMigration
```

## CRUD Operations

### Create

```csharp
public class UserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User> CreateUserAsync(string name, string email)
    {
        var user = new User
        {
            Name = name,
            Email = email,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }
}
```

### Read

```csharp
// Get by ID
var user = await _context.Users.FindAsync(id);

// Get with condition
var activeUsers = await _context.Users
    .Where(u => u.IsActive)
    .ToListAsync();

// Get single or default
var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Email == email);

// Include related data
var blog = await _context.Blogs
    .Include(b => b.Posts)
    .FirstOrDefaultAsync(b => b.Id == id);

// Include nested data
var blog = await _context.Blogs
    .Include(b => b.Posts)
        .ThenInclude(p => p.Tags)
    .FirstOrDefaultAsync(b => b.Id == id);
```

### Update

```csharp
public async Task UpdateUserAsync(int id, string name)
{
    var user = await _context.Users.FindAsync(id);

    if (user != null)
    {
        user.Name = name;
        await _context.SaveChangesAsync();
    }
}

// ExecuteUpdate (EF Core 7+) - bulk update
await _context.Users
    .Where(u => !u.IsActive)
    .ExecuteUpdateAsync(s => s
        .SetProperty(u => u.IsActive, true));
```

### Delete

```csharp
public async Task DeleteUserAsync(int id)
{
    var user = await _context.Users.FindAsync(id);

    if (user != null)
    {
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }
}

// ExecuteDelete (EF Core 7+) - bulk delete
await _context.Users
    .Where(u => !u.IsActive)
    .ExecuteDeleteAsync();
```

## Querying with LINQ

```csharp
// Filtering
var recentPosts = await _context.Posts
    .Where(p => p.PublishedAt > DateTime.UtcNow.AddDays(-7))
    .ToListAsync();

// Ordering
var posts = await _context.Posts
    .OrderByDescending(p => p.PublishedAt)
    .ThenBy(p => p.Title)
    .ToListAsync();

// Projection
var postSummaries = await _context.Posts
    .Select(p => new { p.Id, p.Title, p.PublishedAt })
    .ToListAsync();

// Pagination
var posts = await _context.Posts
    .OrderBy(p => p.Id)
    .Skip((page - 1) * pageSize)
    .Take(pageSize)
    .ToListAsync();

// Aggregation
var postCount = await _context.Posts.CountAsync();
var avgLength = await _context.Posts.AverageAsync(p => p.Content.Length);

// Grouping
var postsByBlog = await _context.Posts
    .GroupBy(p => p.BlogId)
    .Select(g => new
    {
        BlogId = g.Key,
        PostCount = g.Count()
    })
    .ToListAsync();
```

## Repository Pattern

```csharp
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id)
        => await _dbSet.FindAsync(id);

    public async Task<IEnumerable<T>> GetAllAsync()
        => await _dbSet.ToListAsync();

    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
```

## Complete Example

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=blog.db"));

builder.Services.AddScoped<IBlogService, BlogService>();

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Endpoints
app.MapGet("/blogs", async (IBlogService service) =>
    await service.GetAllAsync());

app.MapGet("/blogs/{id}", async (int id, IBlogService service) =>
    await service.GetByIdAsync(id) is Blog blog
        ? Results.Ok(blog)
        : Results.NotFound());

app.MapPost("/blogs", async (CreateBlogRequest request, IBlogService service) =>
{
    var blog = await service.CreateAsync(request.Title, request.Url);
    return Results.Created($"/blogs/{blog.Id}", blog);
});

app.MapPost("/blogs/{blogId}/posts", async (
    int blogId,
    CreatePostRequest request,
    IBlogService service) =>
{
    var post = await service.AddPostAsync(blogId, request.Title, request.Content);
    return Results.Created($"/posts/{post.Id}", post);
});

app.Run();

// Service
public class BlogService : IBlogService
{
    private readonly AppDbContext _context;

    public BlogService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Blog>> GetAllAsync()
        => await _context.Blogs
            .Include(b => b.Posts)
            .ToListAsync();

    public async Task<Blog?> GetByIdAsync(int id)
        => await _context.Blogs
            .Include(b => b.Posts)
            .FirstOrDefaultAsync(b => b.Id == id);

    public async Task<Blog> CreateAsync(string title, string url)
    {
        var blog = new Blog { Title = title, Url = url };
        _context.Blogs.Add(blog);
        await _context.SaveChangesAsync();
        return blog;
    }

    public async Task<Post> AddPostAsync(int blogId, string title, string content)
    {
        var post = new Post
        {
            BlogId = blogId,
            Title = title,
            Content = content,
            PublishedAt = DateTime.UtcNow
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        return post;
    }
}
```

## Summary

You've learned:
- Setting up Entity Framework Core
- Creating entities and DbContext
- Running migrations
- CRUD operations
- Querying with LINQ
- Include for related data
- Repository pattern

## Next Steps

Continue to [Testing](/guide/dotnet/09-testing) to learn about unit and integration testing!
