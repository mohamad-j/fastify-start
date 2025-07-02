import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

export class GuardGenerator {
  constructor() {
    this.projectRoot = process.cwd();
  }

  generate(name, options) {
    const guardFile = join(this.projectRoot, 'backend', 'guards', `${name}.guard.js`);
    
    if (existsSync(guardFile)) {
      console.error(chalk.red(`❌ Guard '${name}' already exists!`));
      process.exit(1);
    }

    console.log(chalk.yellow(`🛡️  Creating guard: ${name}`));
    
    const guardContent = this.getGuardTemplate(name, options);
    writeFileSync(guardFile, guardContent);
    
    console.log(chalk.green(`✅ Successfully created guard: ${name}`));
    console.log(chalk.yellow(`📝 Guard file: backend/guards/${name}.guard.js`));
    console.log(chalk.cyan('💡 Use this guard in your routes with: { preHandler: ' + name + 'Guard }'));
  }

  getGuardTemplate(name, options) {
    const isRoleBased = options.roleBased;
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    if (isRoleBased) {
      return `export async function ${name}Guard(request, reply) {
  try {
    // TODO: Extract user information from request (token, session, etc.)
    const user = request.user; // Assuming user is attached by auth middleware
    
    if (!user) {
      return reply.status(401).send({
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }
    
    // TODO: Implement role-based authorization logic
    const requiredRoles = request.routeOptions?.config?.roles || [];
    const userRoles = user.roles || [];
    
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        request.log.warn(\`[\${capitalizedName} Guard] Access denied for user \${user.id}. Required roles: \${requiredRoles.join(', ')}, User roles: \${userRoles.join(', ')}\`);
        
        return reply.status(403).send({
          success: false,
          message: 'Insufficient permissions',
          code: 'FORBIDDEN',
          required: requiredRoles,
          current: userRoles
        });
      }
    }
    
    // TODO: Add additional authorization checks
    // Example: resource-based permissions, time-based access, etc.
    
    request.log.info(\`[\${capitalizedName} Guard] Access granted for user \${user.id}\`);
    
  } catch (error) {
    request.log.error(\`[\${capitalizedName} Guard] Error:\`, error);
    
    return reply.status(500).send({
      success: false,
      message: 'Authorization check failed',
      code: 'INTERNAL_ERROR'
    });
  }
}

// Helper function to create role-specific guards
export function createRoleGuard(allowedRoles) {
  return async function roleBasedGuard(request, reply) {
    try {
      const user = request.user;
      
      if (!user) {
        return reply.status(401).send({
          success: false,
          message: 'Authentication required'
        });
      }
      
      const userRoles = user.roles || [];
      const hasRole = allowedRoles.some(role => userRoles.includes(role));
      
      if (!hasRole) {
        return reply.status(403).send({
          success: false,
          message: 'Insufficient permissions',
          required: allowedRoles,
          current: userRoles
        });
      }
      
    } catch (error) {
      request.log.error('Role guard error:', error);
      return reply.status(500).send({
        success: false,
        message: 'Authorization failed'
      });
    }
  };
}

// Pre-defined role guards
export const adminGuard = createRoleGuard(['admin']);
export const moderatorGuard = createRoleGuard(['admin', 'moderator']);
export const userGuard = createRoleGuard(['admin', 'moderator', 'user']);`;
    } else {
      return `export async function ${name}Guard(request, reply) {
  try {
    // TODO: Implement your authorization logic here
    console.log(\`[\${capitalizedName} Guard] Checking authorization for: \${request.method} \${request.url}\`);
    
    // Example: Check if user is authenticated
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      request.log.warn(\`[\${capitalizedName} Guard] No authorization header provided\`);
      
      return reply.status(401).send({
        success: false,
        message: 'Authorization header required',
        code: 'MISSING_AUTH_HEADER'
      });
    }
    
    // Example: Validate token format
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token) {
      request.log.warn(\`[\${capitalizedName} Guard] Invalid token format\`);
      
      return reply.status(401).send({
        success: false,
        message: 'Invalid token format',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }
    
    // TODO: Validate the token (JWT, API key, session, etc.)
    // Example with JWT:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // request.user = decoded;
    
    // For now, just check if token exists
    if (token === 'invalid-token') {
      return reply.status(401).send({
        success: false,
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }
    
    // TODO: Add user information to request
    request.user = {
      id: 1,
      username: 'demo-user',
      // Add more user properties as needed
    };
    
    request.log.info(\`[\${capitalizedName} Guard] Authorization successful\`);
    
  } catch (error) {
    request.log.error(\`[\${capitalizedName} Guard] Error:\`, error);
    
    return reply.status(500).send({
      success: false,
      message: 'Authorization check failed',
      code: 'INTERNAL_ERROR'
    });
  }
}

// Optional: Create a configurable guard
export function create${capitalizedName}Guard(options = {}) {
  const config = {
    requireAuth: true,
    allowedOrigins: [],
    maxRequestsPerMinute: 60,
    ...options
  };
  
  return async function configurable${capitalizedName}Guard(request, reply) {
    try {
      // Rate limiting example
      if (config.maxRequestsPerMinute) {
        // TODO: Implement rate limiting logic
        // This could use Redis, in-memory cache, etc.
      }
      
      // Origin checking example
      if (config.allowedOrigins.length > 0) {
        const origin = request.headers.origin;
        if (origin && !config.allowedOrigins.includes(origin)) {
          return reply.status(403).send({
            success: false,
            message: 'Origin not allowed'
          });
        }
      }
      
      // Use base guard logic
      if (config.requireAuth) {
        await ${name}Guard(request, reply);
      }
      
    } catch (error) {
      request.log.error('Configurable guard error:', error);
      return reply.status(500).send({
        success: false,
        message: 'Guard configuration error'
      });
    }
  };
}`;
    }
  }
}
