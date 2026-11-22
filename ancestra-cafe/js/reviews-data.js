/* No fictional testimonials are preloaded. These are only customer-submitted project-demo reviews. */
const SEED_REVIEWS = [];
function getReviews(){const list=Store.get("reviews",null);if(!list){Store.set("reviews",[]);return [];}return list;}
const starString=n=>"★".repeat(n)+"☆".repeat(5-n);
