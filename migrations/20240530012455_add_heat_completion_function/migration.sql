-- This is a migration to add the Postgres function for heat completion and setting the next heat.
-- Create or replace the function
CREATE OR REPLACE FUNCTION mark_heat_complete_and_set_next(race_id INT, heat_id INT) RETURNS VOID AS $$
DECLARE
    next_heat RECORD;
    next_race RECORD;
BEGIN
    -- Mark all heats in the current race as not current
    UPDATE heats SET isCurrent = FALSE WHERE raceId = race_id;

    -- Mark the specific heat as complete
    UPDATE heats SET isCompleted = TRUE, isCurrent = FALSE WHERE id = heat_id;

    -- Find the next heat in the same race
    SELECT * INTO next_heat FROM heats
    WHERE raceId = race_id AND isCompleted = FALSE
    ORDER BY heatNum ASC
    LIMIT 1;

    IF FOUND THEN
        -- Set the next heat as current
        UPDATE heats SET isCurrent = TRUE WHERE id = next_heat.id;
    ELSE
        -- Find the next race
        SELECT * INTO next_race FROM races
        WHERE carnivalId = (SELECT carnivalId FROM races WHERE id = race_id)
        AND "order" > (SELECT "order" FROM races WHERE id = race_id)
        AND isCompleted = FALSE
        ORDER BY "order" ASC
        LIMIT 1;

        IF FOUND THEN
            -- Set the first heat of the next race as current
            UPDATE heats SET isCurrent = TRUE WHERE id = (
                SELECT id FROM heats
                WHERE raceId = next_race.id
                ORDER BY heatNum ASC
                LIMIT 1
            );
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;
