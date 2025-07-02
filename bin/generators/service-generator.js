import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

export class ServiceGenerator {
  constructor() {
    this.projectRoot = process.cwd();
  }

  generate(name, options) {
    const serviceFile = join(this.projectRoot, 'backend', 'services', `${name}.service.js`);
    
    if (existsSync(serviceFile)) {
      console.error(chalk.red(`❌ Service '${name}' already exists!`));
      process.exit(1);
    }

    console.log(chalk.cyan(`⚙️  Creating service: ${name}`));
    
    const serviceContent = this.getServiceTemplate(name, options);
    writeFileSync(serviceFile, serviceContent);
    
    // Update DI container if singleton option is provided
    if (options.singleton) {
      this.updateDIContainer(name);
    }
    
    console.log(chalk.green(`✅ Successfully created service: ${name}`));
    console.log(chalk.yellow(`📝 Service file: backend/services/${name}.service.js`));
    
    if (options.singleton) {
      console.log(chalk.cyan('💡 Service has been registered in DI container as singleton'));
    }
    
    if (options.database) {
      console.log(chalk.cyan('💡 Database connection example has been added'));
    }
  }

  getServiceTemplate(name, options) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const hasDatabase = options.database;
    
    let imports = '';
    let constructor = '';
    let methods = '';
    
    if (hasDatabase) {
      imports = `// TODO: Import your database client
// import { pool } from '../config/database.js';

`;
      constructor = `  constructor() {
    // TODO: Initialize database connection if needed
    // this.db = pool;
  }

`;
      methods = `
  // Database operations
  async findAll(filters = {}) {
    try {
      // TODO: Implement database query
      // const query = 'SELECT * FROM ${name}s WHERE $1';
      // const result = await this.db.query(query, [filters]);
      // return result.rows;
      
      return [];
    } catch (error) {
      throw new Error(\`Failed to retrieve ${name}s: \${error.message}\`);
    }
  }

  async findById(id) {
    try {
      // TODO: Implement database query
      // const query = 'SELECT * FROM ${name}s WHERE id = $1';
      // const result = await this.db.query(query, [id]);
      // return result.rows[0] || null;
      
      return null;
    } catch (error) {
      throw new Error(\`Failed to retrieve ${name}: \${error.message}\`);
    }
  }

  async create(data) {
    try {
      // TODO: Implement database insert
      // const query = 'INSERT INTO ${name}s (name, description) VALUES ($1, $2) RETURNING *';
      // const result = await this.db.query(query, [data.name, data.description]);
      // return result.rows[0];
      
      return { id: Date.now(), ...data };
    } catch (error) {
      throw new Error(\`Failed to create ${name}: \${error.message}\`);
    }
  }

  async update(id, data) {
    try {
      // TODO: Implement database update
      // const query = 'UPDATE ${name}s SET name = $1, description = $2 WHERE id = $3 RETURNING *';
      // const result = await this.db.query(query, [data.name, data.description, id]);
      // return result.rows[0];
      
      return { id, ...data };
    } catch (error) {
      throw new Error(\`Failed to update ${name}: \${error.message}\`);
    }
  }

  async delete(id) {
    try {
      // TODO: Implement database delete
      // const query = 'DELETE FROM ${name}s WHERE id = $1 RETURNING *';
      // const result = await this.db.query(query, [id]);
      // return result.rows[0];
      
      return { id, deleted: true };
    } catch (error) {
      throw new Error(\`Failed to delete ${name}: \${error.message}\`);
    }
  }`;
    } else {
      methods = `
  // Business logic methods
  async process${capitalizedName}(data) {
    try {
      // TODO: Implement your business logic
      console.log(\`Processing ${name}:\`, data);
      
      // Example: validation, transformation, external API calls, etc.
      const processedData = {
        ...data,
        processed: true,
        timestamp: new Date().toISOString()
      };
      
      return processedData;
    } catch (error) {
      throw new Error(\`Failed to process ${name}: \${error.message}\`);
    }
  }

  async validate${capitalizedName}(data) {
    try {
      // TODO: Add validation logic
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data provided');
      }
      
      if (!data.name) {
        throw new Error('Name is required');
      }
      
      return true;
    } catch (error) {
      throw new Error(\`Validation failed: \${error.message}\`);
    }
  }`;
    }

    return `${imports}export class ${capitalizedName}Service {
${constructor}  // Service methods${methods}

  // Utility methods
  async formatResponse(data, message = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  async handleError(error, context = '${name} operation') {
    console.error(\`[\${context}] Error:\`, error);
    
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    };
  }
}`;
  }

  updateDIContainer(name) {
    try {
      const containerFile = join(this.projectRoot, 'backend', 'di', 'container.js');
      
      if (!existsSync(containerFile)) {
        console.log(chalk.yellow('⚠️  DI container not found, skipping registration'));
        return;
      }

      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      const serviceName = `${capitalizedName}Service`;
      
      console.log(chalk.cyan(`📝 Add this to your DI container:`));
      console.log(chalk.gray(`  import { ${serviceName} } from '../services/${name}.service.js';`));
      console.log(chalk.gray(`  container.register('${serviceName}', ${serviceName});`));
      
    } catch (error) {
      console.log(chalk.yellow('⚠️  Could not update DI container automatically'));
    }
  }
}
