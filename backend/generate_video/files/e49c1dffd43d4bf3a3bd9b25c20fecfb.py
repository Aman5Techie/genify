from manim import *

class GenerateFromUser(Scene):
    def construct(self):
        # Step 1: Draw a box labeled 'User Query'
        user_query = Rectangle(width=4, height=2, color=BLUE).shift(UP * 2)
        user_query_label = Text("User Query", font_size=24).move_to(user_query.get_center())
        
        # Step 2: Draw an arrow from 'User Query' to another box labeled 'Redis Cache'
        redis_cache = Rectangle(width=4, height=2, color=YELLOW).shift(DOWN * 2)
        redis_cache_label = Text("Redis Cache", font_size=24).move_to(redis_cache.get_center())
        arrow_user_to_redis = Arrow(user_query.get_bottom(), redis_cache.get_top(), color=GREEN)
        
        # Step 3: Display a cloud above the Redis Cache box with the text 'No data in cache'
        no_data_cloud = Text("No data in cache", font_size=20).shift(redis_cache.get_top() + UP * 1.5)
        
        # Step 4: Show a red cross (X) on the Redis Cache box to indicate a cache miss
        cache_miss_cross = Text("X", font_size=40, color=RED).move_to(redis_cache.get_center())
        
        # Step 5: Draw an arrow from the Redis Cache box to a third box labeled 'Database Query'
        database_query = Rectangle(width=4, height=2, color=PURPLE).shift(DOWN * 6)
        database_query_label = Text("Database Query", font_size=24).move_to(database_query.get_center())
        arrow_redis_to_database = Arrow(redis_cache.get_bottom(), database_query.get_top(), color=GREEN)
        
        # Step 6: Display a cloud above the Database Query box with the text 'Getting data from Database'
        getting_data_cloud = Text("Getting data from Database", font_size=20).shift(database_query.get_top() + UP * 1.5)
        
        # Step 7: Draw an arrow from the Database Query box back to the Redis Cache box
        arrow_database_to_redis = Arrow(database_query.get_bottom(), redis_cache.get_top(), color=GREEN)
        
        # Step 8: Remove the red cross from the Redis Cache box to indicate the cache has been updated
        # Step 9: Draw an arrow from the Redis Cache box back to the User Query box to complete the flow
        arrow_redis_to_user = Arrow(redis_cache.get_bottom(), user_query.get_top(), color=GREEN)
        
        # Adding elements to the scene
        self.add(user_query, user_query_label)
        self.add(redis_cache, redis_cache_label)
        self.add(arrow_user_to_redis)
        self.add(no_data_cloud)
        self.add(cache_miss_cross)
        self.add(database_query, database_query_label)
        self.add(arrow_redis_to_database)
        self.add(getting_data_cloud)
        self.add(arrow_database_to_redis)
        self.add(arrow_redis_to_user)
        
        # Animating the flow
        self.play(
            FadeIn(user_query),
            FadeIn(user_query_label),
            GrowArrow(arrow_user_to_redis),
            FadeIn(redis_cache),
            FadeIn(redis_cache_label),
            FadeIn(no_data_cloud),
            FadeIn(cache_miss_cross),
            GrowArrow(arrow_redis_to_database),
            FadeIn(database_query),
            FadeIn(database_query_label),
            FadeIn(getting_data_cloud),
            GrowArrow(arrow_database_to_redis),
            FadeOut(cache_miss_cross),
            GrowArrow(arrow_redis_to_user),
            FadeOut(no_data_cloud)
        )
        self.wait(2)