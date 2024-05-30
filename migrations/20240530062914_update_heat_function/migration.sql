DROP FUNCTION IF EXISTS mark_heat_complete_and_set_next(int,int);
CREATE OR REPLACE FUNCTION mark_heat_complete_and_set_next(input_race_id INT, input_heat_id INT) RETURNS VOID AS $$
DECLARE
    next_heat RECORD;
    next_race RECORD;
BEGIN
    -- Mark all heats in the current race as not current
    UPDATE heat SET is_current = FALSE WHERE race_id = input_race_id;

    -- Mark the specific heat as complete
    UPDATE heat SET is_completed = TRUE, is_current = FALSE WHERE id = input_heat_id;

    -- Find the next heat in the same race
    SELECT * INTO next_heat FROM heat
    WHERE race_id = input_race_id AND is_completed = FALSE
    ORDER BY heat_num ASC
    LIMIT 1;

    IF FOUND THEN
        -- Set the next heat as current
        UPDATE heat SET is_current = TRUE WHERE id = next_heat.id;
    ELSE
        -- Find the next race
        SELECT * INTO next_race FROM race
        WHERE carnival_id = (SELECT carnival_id FROM race WHERE id = input_race_id)
        AND "order" > (SELECT "order" FROM race WHERE id = input_race_id)
        AND is_completed = FALSE
        ORDER BY "order" ASC
        LIMIT 1;

        IF FOUND THEN
            -- Set the first heat of the next race as current
            UPDATE heat SET is_current = TRUE WHERE id = (
                SELECT id FROM heat
                WHERE race_id = next_race.id
                ORDER BY heat_num ASC
                LIMIT 1
            );
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;

