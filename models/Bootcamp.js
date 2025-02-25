const mongoose=require('mongoose')
const slugify=require('slugify')
const geocoder=require('../utils/nodeGeocoder')
const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please add the name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be over 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'please add the description'],
        maxlength: [500, 'Name can not be over 500 characters']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number cannot be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        // GeoJson points
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
            
        },
        formattedAddress: String,
        street: String,
        city: String,
        zipcode: String,
        country: String
    
    },
    careers: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating cannot be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },

    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true, // Ensure every bootcamp has an owner
      },
    
      // Users and their roles/permissions
      userRoles: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
          },
          role: {
            type: String,
            enum: ['owner', 'editor'],
            required: true,
          },
       
        },
        
      ],
      permissions: {
        type: Map, // Key-value pairs for action-specific roles
        of: [String], // The value is an array of roles
        default: {}, // Default is an empty object
      },
    
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });
// Create bootcamp slug from the name
BootcampSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true})
    next()
})
// Geocode and create location field
// Geocode and create location field
BootcampSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
   
    if (loc.length > 0) {
      this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
      };
      // Do not save address in DB
      this.address = undefined;
    } else {
      throw new Error('Invalid address');
    }
    next();
  });


module.exports=mongoose.model('Bootcamp',BootcampSchema)