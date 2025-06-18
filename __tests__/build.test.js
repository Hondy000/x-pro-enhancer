// Mock modules before any requires
jest.mock('fs');
jest.mock('archiver');
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/'))
}));

describe('build.js', () => {
  let mockFs, mockArchiver, mockArchiveInstance, mockOutputStream;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    jest.resetModules();

    // Setup console mocks
    console.log = jest.fn();
    console.error = jest.fn();

    // Mock process.exit to prevent test failures
    jest.spyOn(process, 'exit').mockImplementation(() => {});

    // Get mocked modules
    mockFs = require('fs');
    mockArchiver = require('archiver');

    // Setup stream mock
    mockOutputStream = {
      on: jest.fn((event, callback) => {
        if (event === 'close') {
          // Simulate immediate close for tests
          setTimeout(callback, 0);
        }
      })
    };

    // Setup archiver instance mock
    mockArchiveInstance = {
      pipe: jest.fn(),
      directory: jest.fn().mockReturnThis(),
      file: jest.fn().mockReturnThis(),
      finalize: jest.fn().mockResolvedValue(),
      pointer: jest.fn().mockReturnValue(12345),
      on: jest.fn((event, callback) => {
        // Store callbacks for later use if needed
      })
    };

    // Configure mocks
    mockFs.existsSync.mockReturnValue(false);
    mockFs.mkdirSync.mockImplementation(() => {});
    mockFs.createWriteStream.mockReturnValue(mockOutputStream);
    mockFs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }));
    mockFs.statSync.mockReturnValue({ size: 12345 });

    mockArchiver.mockReturnValue(mockArchiveInstance);
  });

  afterEach(() => {
    // Restore process.exit
    process.exit.mockRestore();
  });

  describe('Directory Creation', () => {
    it('should create dist directory if it does not exist', (done) => {
      // Return false for dist directory to trigger creation
      mockFs.existsSync.mockImplementation((path) => {
        if (path.includes('dist')) return false;
        return true; // Other files exist
      });

      require('../scripts/build.js');

      setTimeout(() => {
        expect(mockFs.mkdirSync).toHaveBeenCalled();
        done();
      }, 10);
    });

    it('should not create directory if it already exists', () => {
      mockFs.existsSync.mockReturnValue(true);

      require('../scripts/build.js');

      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('Version Reading', () => {
    it('should read version from manifest.json', () => {
      require('../scripts/build.js');

      expect(mockFs.readFileSync).toHaveBeenCalled();
      const readCall = mockFs.readFileSync.mock.calls.find(
        (call) => call[0].includes('manifest.json')
      );
      expect(readCall).toBeTruthy();
      expect(readCall[1]).toBe('utf8');
    });
  });

  describe('Archive Creation', () => {
    it('should create zip archive with correct compression', () => {
      require('../scripts/build.js');

      expect(mockArchiver).toHaveBeenCalledWith('zip', {
        zlib: { level: 9 }
      });
    });

    it('should pipe archive to output stream', () => {
      require('../scripts/build.js');

      expect(mockArchiveInstance.pipe).toHaveBeenCalledWith(mockOutputStream);
    });

    it('should add files and directories to archive', (done) => {
      mockFs.existsSync.mockImplementation((path) => {
        // Return true for files we expect to be included
        if (path.includes('manifest.json') ||
            path.includes('.js') ||
            path.includes('.html') ||
            path.includes('.css') ||
            path.includes('icons') ||
            path.includes('images')) {
          return true;
        }
        return false;
      });

      mockFs.statSync.mockImplementation((path) => ({
        isDirectory: () => path.includes('icons') || path.includes('images'),
        size: 1000
      }));

      require('../scripts/build.js');

      setTimeout(() => {
        // Check that files and directories were added
        expect(mockArchiveInstance.file).toHaveBeenCalled();
        expect(mockArchiveInstance.directory).toHaveBeenCalled();
        done();
      }, 10);
    });

    it('should finalize archive', () => {
      require('../scripts/build.js');

      expect(mockArchiveInstance.finalize).toHaveBeenCalled();
    });
  });

  describe('Success Handling', () => {
    it('should log success message on completion', (done) => {
      require('../scripts/build.js');

      setTimeout(() => {
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('✅ Build complete')
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining('x-to-bird-v1.0.0.zip')
        );
        done();
      }, 10);
    });
  });

  describe('Error Handling', () => {
    it('should throw on archive errors', () => {
      // Setup error listener that will throw
      mockArchiveInstance.on.mockImplementation((event, callback) => {
        if (event === 'error') {
          // This will throw in the actual implementation
          expect(() => callback(new Error('Archive failed'))).toThrow();
        }
      });

      require('../scripts/build.js');

      // Verify error handler was registered
      expect(mockArchiveInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should catch and log build errors', (done) => {
      // Make finalize reject to trigger catch block
      mockArchiveInstance.finalize.mockRejectedValue(new Error('Build failed'));

      require('../scripts/build.js');

      setTimeout(() => {
        expect(console.error).toHaveBeenCalledWith(
          '❌ Build failed:',
          expect.any(Error)
        );
        expect(process.exit).toHaveBeenCalledWith(1);
        done();
      }, 10);
    });
  });
});
